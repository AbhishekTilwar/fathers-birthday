import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from './asset';

type Synth = { ctx: AudioContext; master: GainNode; stop: () => void };

/** Soft, warm ambient pad plus faint projector hiss. Used only when no audio file exists. */
function startSynth(): Synth | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.connect(master).connect(ctx.destination);

  const nodes: AudioScheduledSourceNode[] = [];
  // A major-ish open voicing: A2 E3 A3 C#4 (gentle, nostalgic)
  [110, 164.81, 220, 277.18].forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 4;
    const g = ctx.createGain();
    g.gain.value = 0.07;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07 + i * 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(g.gain);
    osc.connect(g).connect(filter);
    osc.start();
    lfo.start();
    nodes.push(osc, lfo);
  });

  // projector hiss
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const nf = ctx.createBiquadFilter();
  nf.type = 'bandpass';
  nf.frequency.value = 3000;
  const ng = ctx.createGain();
  ng.gain.value = 0.004;
  noise.connect(nf).connect(ng).connect(master);
  noise.start();
  nodes.push(noise);

  return {
    ctx,
    master,
    stop: () => {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      window.setTimeout(() => {
        nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
        void ctx.close();
      }, 900);
    },
  };
}

/**
 * Music is ON by default. Browsers refuse to play sound before the visitor touches the page,
 * so playback is requested at load and, if blocked, starts on the first tap/click/key press.
 * The toggle turns it off (and on again) at any time.
 */
export function useSound(src?: string) {
  const [on, setOn] = useState(true);
  const wanted = useRef(true);
  const blocked = useRef(false);
  const unlockedAt = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<Synth | null>(null);
  const fileFailed = useRef(false);

  const startSynth_ = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    fileFailed.current = true;
    if (!synthRef.current) synthRef.current = startSynth();
    const ctx = synthRef.current?.ctx;
    if (ctx && ctx.state === 'suspended') {
      blocked.current = true;
      void ctx.resume().then(() => { if (ctx.state === 'running') blocked.current = false; });
    }
  }, []);

  const tryStart = useCallback(() => {
    if (!wanted.current) return;
    if (src && !fileFailed.current) {
      const a = audioRef.current ?? new Audio(asset(src));
      audioRef.current = a;
      a.loop = true;
      a.volume = 0.5;
      a.onerror = startSynth_;
      a.play().then(() => { blocked.current = false; }).catch((e: Error) => {
        if (e?.name === 'NotAllowedError') blocked.current = true; // wait for a tap
        else startSynth_();
      });
    } else {
      startSynth_();
    }
  }, [src, startSynth_]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    synthRef.current?.stop();
    synthRef.current = null;
    blocked.current = false;
  }, []);

  useEffect(() => {
    tryStart();
    const unlock = () => {
      if (!wanted.current || !blocked.current) return;
      unlockedAt.current = Date.now();
      blocked.current = false;
      if (synthRef.current) void synthRef.current.ctx.resume();
      else tryStart();
    };
    const evs = ['pointerdown', 'touchend', 'keydown', 'click'];
    evs.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, unlock, { capture: true }));
      audioRef.current?.pause();
      synthRef.current?.stop();
      synthRef.current = null;
    };
  }, [tryStart]);

  const toggle = useCallback(() => {
    // the tap that unlocked autoplay must not also switch the music off
    if (wanted.current && Date.now() - unlockedAt.current < 500) return;
    if (wanted.current) { wanted.current = false; stop(); setOn(false); }
    else { wanted.current = true; setOn(true); tryStart(); }
  }, [stop, tryStart]);

  return { on, toggle };
}
