import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT, FONT_EN, OBJECTS, mix } from './theme.js';

/* ভেতরে আসার অ্যানিমেশন: নিচ থেকে উঠে আসা আর ঝাপসা থেকে পরিষ্কার */
export const useIn = (delay = 0, damping = 14) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } });
};
export const Rise = ({ delay = 0, y = 60, children, style }) => {
  const p = useIn(delay);
  return <div style={{ transform: `translateY(${(1 - p) * y}px)`, opacity: p, filter: `blur(${(1 - p) * 8}px)`, ...style }}>{children}</div>;
};

/* পটভূমি: ধীরে নড়া রঙের আলো, আর স্টাইল অনুযায়ী নকশা */
export const Background = ({ t }) => {
  const f = useCurrentFrame(), { width, height } = useVideoConfig();
  const a = Math.sin(f / 70) * 60, b = Math.cos(f / 90) * 80;
  const glow = t.dark ? 0.55 : 0.35;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${t.bg} 0%, ${t.bg2} 100%)` }}>
      <div style={{ position: 'absolute', width: width * 0.9, height: width * 0.9, borderRadius: '50%', left: -width * 0.25 + a, top: -width * 0.2 + b,
        background: `radial-gradient(circle, ${t.primary}${t.dark ? '88' : '55'} 0%, transparent 65%)`, opacity: glow }} />
      <div style={{ position: 'absolute', width: width * 0.8, height: width * 0.8, borderRadius: '50%', right: -width * 0.3 - a, bottom: -width * 0.15 + b,
        background: `radial-gradient(circle, ${t.hi}${t.dark ? '77' : '66'} 0%, transparent 65%)`, opacity: glow }} />
      {t.style === 'geometric' && <Pattern t={t} />}
      {t.style === 'editorial' && <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, ${t.line}55 0 1px, transparent 1px 64px)` }} />}
      {(t.style === 'dark' || t.style === 'kinetic') && <AbsoluteFill style={{ backgroundImage: `radial-gradient(${t.line} 1.5px, transparent 1.5px)`, backgroundSize: '44px 44px', opacity: 0.5,
        transform: `translateY(${(f % 44)}px)` }} />}
      {t.style === 'clean' && <AbsoluteFill style={{ backgroundImage: `linear-gradient(${t.line}55 1px, transparent 1px), linear-gradient(90deg, ${t.line}55 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.6 }} />}
    </AbsoluteFill>
  );
};
/* ইসলামিক আট কোনা তারার নকশা */
const Pattern = ({ t }) => {
  const f = useCurrentFrame();
  const star = (cx, cy, r) => { const pts = []; for (let i = 0; i < 16; i++) { const ang = (Math.PI / 8) * i, rr = i % 2 ? r * 0.62 : r; pts.push(`${cx + rr * Math.cos(ang)},${cy + rr * Math.sin(ang)}`); } return pts.join(' '); };
  const cells = []; for (let x = 0; x < 6; x++) for (let y = 0; y < 12; y++) cells.push([x * 220 + (y % 2) * 110, y * 190]);
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.16, transform: `translateY(${-(f % 190)}px)` }}>
      {cells.map(([x, y], i) => <polygon key={i} points={star(x, y, 70)} fill="none" stroke={t.gold || t.hi} strokeWidth="2" />)}
    </svg>
  );
};

/* উপরে লোগো আর নাম, নিচে ওয়েবসাইট আর অগ্রগতির দাগ */
export const Chrome = ({ t, progress = 0, wide }) => {
  const { width } = useVideoConfig(), pad = wide ? 56 : 64;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: pad, left: pad, display: 'flex', alignItems: 'center', gap: 18 }}>
        {(typeof t.logo === 'string' && t.logo.trim()) ? <Img src={t.logo} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', boxShadow: `0 0 0 4px ${t.dark ? '#ffffff' : t.primary}` }} />
          : <div style={{ width: 84, height: 84, borderRadius: '50%', background: t.primary, color: '#fff', fontFamily: FONT_EN, fontWeight: 800, fontSize: 34, display: 'grid', placeItems: 'center' }}>{(t.name || 'AH').slice(0, 2).toUpperCase()}</div>}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: t.ink, letterSpacing: 0.5 }}>{t.name}</div>
      </div>
      <div style={{ position: 'absolute', left: pad, right: pad, bottom: pad - 10, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {t.website && <div style={{ fontFamily: FONT_EN, fontWeight: 600, fontSize: 28, color: t.sub, textAlign: 'center' }}>{t.website.replace(/^https?:\/\//, '')}</div>}
        <div style={{ height: 8, borderRadius: 8, background: t.dark ? 'rgba(255,255,255,0.18)' : mix(t.primary, '#ffffff', 0.75), overflow: 'hidden', width: width - pad * 2 }}>
          <div style={{ width: `${Math.min(100, progress * 100)}%`, height: '100%', borderRadius: 8, background: `linear-gradient(90deg, ${t.primary}, ${t.hi})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ভাসমান 3D প্রতীক */
export const Floater = ({ name, size = 300, t, still }) => {
  const f = useCurrentFrame(), pin = useIn(4, 10), p = still ? 1 : pin;
  const ch = OBJECTS[name]; if (!ch) return null;
  const bob = Math.sin(f / 14) * 16, rot = Math.sin(f / 30) * 8;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center', transform: `scale(${0.4 + p * 0.6}) translateY(${bob}px) rotate(${rot}deg)`, opacity: p }}>
      <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${t.hi}, ${t.primary} 70%)`, boxShadow: `0 40px 80px -20px ${t.primary}cc`, opacity: 0.9 }} />
      <div style={{ position: 'relative', fontSize: size * 0.48, filter: 'drop-shadow(0 18px 18px rgba(0,0,0,0.35))' }}>{ch}</div>
    </div>
  );
};

/* মূল শব্দগুলো রঙিন করে দেখানো */
export const Hl = ({ text, words = [], color }) => {
  if (!words.length) return <>{text}</>;
  const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
  return <>{String(text).split(re).map((part, i) => (words.includes(part) ? <span key={i} style={{ color, background: `${color}22`, borderRadius: 14, padding: '0 10px' }}>{part}</span> : <span key={i}>{part}</span>))}</>;
};

export const Kicker = ({ t, children }) => (
  <div style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 32, color: t.dark ? t.ink : t.primary, background: t.dark ? `${t.primary}66` : `${t.primary}1f`,
    border: `2px solid ${t.dark ? t.line : t.primary + '55'}`, borderRadius: 999, padding: '10px 28px', letterSpacing: 0.5 }}>{children}</div>
);
export const fade = (frame, dur) => interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
