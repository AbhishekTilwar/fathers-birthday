import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * One persistent, wordless "keep scrolling" indicator: gently bobbing down-chevrons that stay
 * on screen until the end of the page. Tapping scrolls down one screen.
 */
export function ScrollCue() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const on = () => setShow(window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 260);
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <button type="button" className={`scroll-prompt${show ? '' : ' hidden'}`} aria-label="Scroll down to continue" tabIndex={show ? 0 : -1}
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}>
      <span className="chevs" aria-hidden="true"><ChevronDown size={26} /><ChevronDown size={26} /></span>
    </button>
  );
}
