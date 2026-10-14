import { Volume2, VolumeX } from 'lucide-react';

export function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? 'Turn music off' : 'Turn music on'}
    >
      {on ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
      <span>{on ? 'Music on' : 'Music off'}</span>
    </button>
  );
}
