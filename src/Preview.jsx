import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { FONT, FONT_EN } from './theme.js';

/* ===== রঙের ইঞ্জিন: ব্র্যান্ডের primary/accent থেকে সব রং নিজে বের করে ===== */
const clampByte = (v) => Math.max(0, Math.min(255, Math.round(v)));
const toRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '')); const x = m ? m[1] : '3F4C7A'; return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)); };
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => clampByte(v).toString(16).padStart(2, '0')).join('');
const rgb2hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2; const d = mx - mn;
  if (d) { s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h * 360, s, l]; };
const hsl2rgb = (h, s, l) => { h = ((h % 360) + 360) % 360 / 360; const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const t = (x) => { if (x < 0) x += 1; if (x > 1) x -= 1; if (x < 1 / 6) return p + (q - p) * 6 * x; if (x < 1 / 2) return q; if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6; return p; };
  return [t(h + 1 / 3), t(h), t(h - 1 / 3)].map((v) => v * 255); };
const hsl = (h, s, l) => { const [r, g, b] = hsl2rgb(h, s, l); return toHex(r, g, b); };
/* ব্র্যান্ডের রং থেকে একটা পুরো প্যালেট */
export function palette(brand = {}) {
  const [h, s] = rgb2hsl(...toRgb(brand.primary || '#3F4C7A'));
  const [ah, as] = rgb2hsl(...toRgb(brand.accent || brand.primary || '#242B45'));
  return {
    primary: brand.primary || '#3F4C7A',
    deep: hsl(ah, Math.max(0.35, as), 0.12),      // পটভূমির গাঢ় প্রান্ত
    deep2: hsl(h, Math.max(0.4, s), 0.2),         // পটভূমির অন্য প্রান্ত
    pop: hsl(h, Math.min(0.85, s + 0.35), 0.72),  // উজ্জ্বল হাইলাইট (ব্র্যান্ড রঙেরই উজ্জ্বল রূপ)
    popInk: hsl(ah, Math.max(0.5, as), 0.12),     // হাইলাইটের উপর গাঢ় লেখা
    soft: hsl(h, 0.3, 0.9),                        // হালকা পটভূমি
    cream: '#F4FBF7', ink: hsl(ah, 0.45, 0.14), sub: hsl(h, 0.25, 0.42), gold: '#D9B66A',
    h, s,
  };
}

const Logo = ({ src, bg, fg, size = 92, ring }) =>
  src ? <Img src={src} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', boxShadow: ring ? `0 0 0 4px ${ring}` : 'none' }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, fontFamily: FONT, fontWeight: 700, fontSize: size * 0.42, display: 'grid', placeItems: 'center' }}>হু</div>;

/* ===== ধাঁচ ১: Editorial Luxe (ব্র্যান্ড রং + সোনালি) ===== */
export const LookEditorial = ({ brand = {} }) => {
  const c = palette(brand), green = c.ink, gold = c.gold, cream = '#F6F1E7', sub = c.sub;
  const corner = (pos) => (
    <div style={{ position: 'absolute', width: 120, height: 120, borderColor: gold, borderStyle: 'solid', opacity: 0.6,
      ...(pos === 'tl' ? { top: 64, left: 64, borderWidth: '3px 0 0 3px' } : pos === 'tr' ? { top: 64, right: 64, borderWidth: '3px 3px 0 0' }
        : pos === 'bl' ? { bottom: 64, left: 64, borderWidth: '0 0 3px 3px' } : { bottom: 64, right: 64, borderWidth: '0 3px 3px 0' }) }} />
  );
  return (
    <AbsoluteFill style={{ background: cream, fontFamily: FONT }}>
      {['tl', 'tr', 'bl', 'br'].map((p) => <span key={p}>{corner(p)}</span>)}
      <div style={{ position: 'absolute', top: 150, left: 110, fontFamily: FONT_EN, fontSize: 360, fontWeight: 800, color: c.primary, opacity: 0.08, lineHeight: 0.8 }}>01</div>
      <AbsoluteFill style={{ padding: '210px 150px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 54 }}>
          <div style={{ width: 70, height: 2, background: gold }} />
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: gold }}>ইসলামী অর্থনীতি</div>
          <div style={{ width: 70, height: 2, background: gold }} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 118, lineHeight: 1.22, color: green }}>
          হালাল উপার্জনেই<br />প্রকৃত <span style={{ color: gold, borderBottom: `6px solid ${gold}66` }}>বরকত</span>
        </div>
        <div style={{ width: 90, height: 3, background: gold, margin: '58px 0' }} />
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 46, lineHeight: 1.6, color: sub, maxWidth: 760 }}>
          সৎ পথে অল্প আয়েও আল্লাহ এমন বরকত দেন, যা সম্পদের পরিমাণ দিয়ে মাপা যায় না।
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 150, right: 150, bottom: 150, borderTop: `2px solid ${green}22`, paddingTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Logo src={brand.logo} bg={green} fg={cream} size={74} />
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: green }}>{brand.name || 'হুরাইরা'}</div>
        </div>
        <div style={{ fontFamily: FONT_EN, fontWeight: 600, fontSize: 30, color: sub }}>পর্ব ০১</div>
      </div>
    </AbsoluteFill>
  );
};

/* ===== ধাঁচ ২: Bold Kinetic — পুরো রং ব্র্যান্ড থেকে ===== */
export const LookBold = ({ brand = {} }) => {
  const c = palette(brand), pop = c.pop, cream = c.cream;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${c.deep} 0%, ${c.deep2} 60%, ${c.deep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 520, height: 520, border: `3px solid ${pop}`, borderRadius: 60, opacity: 0.25, transform: 'rotate(18deg)' }} />
      <div style={{ position: 'absolute', top: 150, right: 120, fontFamily: FONT_EN, fontWeight: 800, fontSize: 300, color: 'transparent', WebkitTextStroke: `3px ${pop}88`, lineHeight: 0.8 }}>01</div>
      <div style={{ position: 'absolute', top: 120, left: 110, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: c.popInk, background: pop, padding: '12px 30px', borderRadius: 999 }}>ইসলামী অর্থনীতি</div>
      <AbsoluteFill style={{ padding: '0 110px 360px', justifyContent: 'flex-end' }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 158, lineHeight: 1.08, color: cream, letterSpacing: -1 }}>
          হালাল আয়ে<br /><span style={{ display: 'inline-block', background: pop, color: c.popInk, padding: '2px 26px', borderRadius: 18, transform: 'rotate(-2deg)', margin: '14px 0' }}>বরকত</span> থাকে
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 48, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', maxWidth: 820, marginTop: 34 }}>
          সততা থাকলে অল্প সম্পদেও জীবন শান্তিময় হয়।
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, right: 110, bottom: 140, display: 'flex', alignItems: 'center', gap: 22 }}>
        <Logo src={brand.logo} bg={pop} fg={c.popInk} size={80} ring={'rgba(255,255,255,0.3)'} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: cream }}>{brand.name || 'হুরাইরা'}</div>
        <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
          <div style={{ width: '38%', height: '100%', background: pop, borderRadius: 8 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===== ধাঁচ ৩: Glass Minimal — ব্র্যান্ড রং ===== */
export const LookGlass = ({ brand = {} }) => {
  const c = palette(brand), green = c.primary, ink = c.ink;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 70% 10%, ${c.soft} 0%, #EEF5F1 45%, #E4EFEA 100%)`, fontFamily: FONT }}>
      <div style={{ position: 'absolute', width: 620, height: 620, borderRadius: '50%', left: -160, bottom: -140, background: `radial-gradient(circle,${green}33,transparent 70%)` }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', right: -120, top: -120, background: `radial-gradient(circle,${green}26,transparent 70%)` }} />
      <AbsoluteFill style={{ padding: 120, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: 48, padding: '110px 84px',
          boxShadow: '0 50px 110px -40px rgba(15,42,34,0.4)', backdropFilter: 'blur(24px)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 46 }}>
            <Logo src={brand.logo} bg={green} fg={'#fff'} size={64} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: green }}>ইসলামী অর্থনীতি</div>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 104, lineHeight: 1.25, color: ink }}>
            হালাল উপার্জনেই<br />প্রকৃত <span style={{ color: green, position: 'relative' }}>বরকত<span style={{ position: 'absolute', left: 0, right: 0, bottom: 6, height: 14, background: `${green}2e`, borderRadius: 8, zIndex: -1 }} /></span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 44, lineHeight: 1.6, color: c.sub, marginTop: 44, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
            সৎ উপার্জনে অল্পতেই শান্তি, বরকত আর তৃপ্তি আসে।
          </div>
          <div style={{ display: 'inline-block', marginTop: 56, fontFamily: FONT, fontWeight: 700, fontSize: 36, color: '#fff', background: green, padding: '20px 52px', borderRadius: 999 }}>আরও জানুন</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 30, color: green }}>{brand.name || 'হুরাইরা'}</div>
    </AbsoluteFill>
  );
};

/* ===== ধাঁচ ৪: Arabesque — ব্র্যান্ড রং + সোনালি ===== */
const Star8 = ({ cx, cy, r, stroke, sw = 2 }) => {
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (Math.PI / 8) * i, rr = i % 2 ? r * 0.6 : r; pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`); }
  return <polygon points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth={sw} />;
};
export const LookArabesque = ({ brand = {} }) => {
  const c = palette(brand), gold = c.gold, cream = '#F4EAD0', green = c.deep;
  const row = (y) => Array.from({ length: 7 }).map((_, i) => <Star8 key={i} cx={60 + i * 160} cy={y} r={52} stroke={gold} sw={1.5} />);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 900px at 50% 40%, ${c.deep2} 0%, ${green} 70%)`, fontFamily: FONT }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.18 }}>{[60, 1860].map((y) => <g key={y}>{row(y)}</g>)}</svg>
      <div style={{ position: 'absolute', inset: 54, border: `2px solid ${gold}55`, borderRadius: 20 }} />
      <div style={{ position: 'absolute', inset: 70, border: `1px solid ${gold}33`, borderRadius: 14 }} />
      <AbsoluteFill style={{ padding: '240px 150px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <svg width="260" height="60" style={{ marginBottom: 50 }}>
          <line x1="0" y1="30" x2="90" y2="30" stroke={gold} strokeWidth="2" />
          <g transform="translate(130,30)"><Star8 cx={0} cy={0} r={26} stroke={gold} sw={2} /><circle cx="0" cy="0" r="6" fill={gold} /></g>
          <line x1="170" y1="30" x2="260" y2="30" stroke={gold} strokeWidth="2" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: gold, marginBottom: 40 }}>ইসলামী অর্থনীতি</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 112, lineHeight: 1.3, color: cream }}>
          হালাল উপার্জনেই<br />প্রকৃত বরকত
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 44, lineHeight: 1.6, color: `${cream}cc`, marginTop: 50, maxWidth: 740 }}>
          সৎ আয়ে অল্প সম্পদেও আল্লাহ বরকত দান করেন।
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 130, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        <Logo src={brand.logo} bg={gold} fg={green} size={70} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: cream }}>{brand.name || 'হুরাইরা'}</div>
      </div>
    </AbsoluteFill>
  );
};
