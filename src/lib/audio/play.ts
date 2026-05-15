/**
 * Sound design ligero. Generamos los sonidos en tiempo real con Web Audio API
 * para no depender de archivos externos. Sonidos sutiles, no obtrusivos.
 *
 * Toggle global persistido en localStorage. Default: ON (el usuario puede
 * silenciar desde el footer / nav).
 */

const STORAGE_KEY = 'if-sound-enabled';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === '1';
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    window.dispatchEvent(new Event('if-sound-toggle'));
  } catch {
    /* ignore */
  }
}

/**
 * Click breve (220Hz → 120Hz) tipo blip.
 */
export function playClick() {
  if (!isSoundEnabled()) return;
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Swoosh — ruido blanco filtrado + envelope rápido.
 */
export function playSwoosh() {
  if (!isSoundEnabled()) return;
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;

  // Ruido blanco
  const buffer = audio.createBuffer(1, audio.sampleRate * 0.4, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);
  filter.Q.value = 1.2;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(now);
  source.stop(now + 0.4);
}

/**
 * Bell de ring (dos tonos cortos a 660Hz + 880Hz).
 */
export function playBell() {
  if (!isSoundEnabled()) return;
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;

  const play = (freq: number, start: number) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.6);
  };

  play(660, now);
  play(880, now + 0.12);
}
