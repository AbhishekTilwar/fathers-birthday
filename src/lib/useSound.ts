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

/** Sound is off until the visitor asks for it. Never autoplays. */
export function useSound(src?: string) {
  const [on, setOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<Synth | null>(null);
  const fileFailed = useRef(false);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    synthRef.current?.stop();
    synthRef.current = null;
    setOn(false);
  }, []);

  const useFallback = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    fileFailed.current = true;
    if (!synthRef.current) synthRef.current = startSynth();
  }, []);

  const start = useCallback(() => {
    setOn(true);
    if (src && !fileFailed.current) {
      const a = audioRef.current ?? new Audio(asset(src));
      audioRef.current = a;
      a.loop = true;
      a.volume = 0.5;
      a.onerror = useFallback;
      a.play().catch(useFallback);
    } else {
      useFallback();
    }
  }, [src, useFallback]);

  const toggle = useCallback(() => (on ? stop() : start()), [on, start, stop]);

  useEffect(() => () => { audioRef.current?.pause(); synthRef.current?.stop(); }, []);

  return { on, toggle };
}
