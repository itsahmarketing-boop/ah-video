import { loadFont as loadBangla } from '@remotion/google-fonts/HindSiliguri';
import { loadFont as loadLatin } from '@remotion/google-fonts/Poppins';

const bn = loadBangla('normal', { weights: ['400', '600', '700'], subsets: ['bengali', 'latin'] });
const en = loadLatin('normal', { weights: ['500', '700', '800'], subsets: ['latin'] });
export const FONT = `${bn.fontFamily}, ${en.fontFamily}, "Noto Sans Bengali", sans-serif`;
export const FONT_EN = `${en.fontFamily}, ${bn.fontFamily}, sans-serif`;

/* বস্তুর নাম → বড় প্রতীক (রঙিন ইমোজি, উপরে-নিচে ভাসে) */
export const OBJECTS = {
  coins: '🪙', hourglass: '⏳', scale: '⚖️', house: '🏠', cart: '🛒', contract: '📜', calculator: '🧮', bank: '🏦',
  chart: '📈', box: '📦', key: '🔑', notes: '💵', book: '📖', calendar: '📅', mic: '🎙️', dome: '🕌', bulb: '💡', shield: '🛡️'
};

const hex = (h, f) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '')); return m ? '#' + m[1] : f; };
export const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

/* নকশা: ব্র্যান্ডের রং থেকে প্রতিটা স্টাইলের রং */
export function makeTheme(brand = {}, style = 'clean') {
  const primary = hex(brand.primary, '#4F46E5');
  const accent = hex(brand.accent, '#0F172A');
  const base = {
    primary, accent,
    hi: mix(primary, '#ffffff', 0.45),
    name: brand.name || '', website: brand.website || '',
    logo: brand.logo && brand.logo.b64 ? `data:${brand.logo.mime || 'image/png'};base64,${brand.logo.b64}` : '',
  };
  const styles = {
    clean: { bg: '#F8FAFC', bg2: mix(primary, '#ffffff', 0.88), ink: '#0F172A', sub: '#475569', card: '#FFFFFF', line: mix(primary, '#ffffff', 0.7), dark: false },
    editorial: { bg: '#FBF7EF', bg2: '#F1E9D8', ink: '#1C1917', sub: '#57534E', card: '#FFFDF8', line: '#D6CBB4', dark: false, serif: true },
    dark: { bg: mix(accent, '#000000', 0.55), bg2: mix(primary, '#000000', 0.6), ink: '#F8FAFC', sub: '#CBD5E1', card: 'rgba(255,255,255,0.07)', line: 'rgba(255,255,255,0.18)', dark: true },
    kinetic: { bg: primary, bg2: mix(primary, accent, 0.6), ink: '#FFFFFF', sub: 'rgba(255,255,255,0.85)', card: 'rgba(255,255,255,0.12)', line: 'rgba(255,255,255,0.3)', dark: true },
    geometric: { bg: mix(accent, primary, 0.25), bg2: mix(accent, '#000000', 0.35), ink: '#FFFDF5', sub: '#F1E9D8', card: 'rgba(255,255,255,0.08)', line: 'rgba(255,215,140,0.35)', dark: true, gold: '#E8C36A' },
  };
  return { ...base, ...(styles[style] || styles.clean), style: styles[style] ? style : 'clean' };
}
