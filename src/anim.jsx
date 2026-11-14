import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

/* ভিডিওর ধরন বদলানোর উপাদান: প্রতিটা ভিডিও আগেরটা থেকে আলাদা দেখাবে
   v.trans = দৃশ্য বদলের ধরন, v.text = লেখা আসার ধরন, v.card = লেখা কার্ডের ভেতরে কিনা, v.deco = পটভূমির নকশা */
export const VARIANTS = (n = 0) => {
  const trans = ['rise', 'slide', 'zoom', 'flip'], text = ['rise', 'words', 'type', 'pop'], deco = ['blobs', 'rings', 'stripes', 'grid'];
  return { trans: trans[n % 4], text: text[Math.floor(n / 4) % 4], card: Math.floor(n / 2) % 2 === 1, deco: deco[(n + Math.floor(n / 4)) % 4], seed: n };
};

/* দৃশ্যের ভেতরে-বাইরে যাওয়া */
export const SceneTrans = ({ kind = 'rise', dur, children }) => {
  const f = useCurrentFrame(), { fps, width } = useVideoConfig();
  const pin = spring({ frame: f, fps, config: { damping: 16, mass: 0.8 } });
  const out = interpolate(f, [dur - 10, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const op = Math.min(1, pin * 1.4) * (1 - out);
  let tf = '';
  if (kind === 'slide') tf = `translateX(${(1 - pin) * width * 0.35 - out * width * 0.35}px)`;
  else if (kind === 'zoom') tf = `scale(${0.85 + pin * 0.15 + out * 0.12})`;
  else if (kind === 'flip') tf = `perspective(1600px) rotateY(${(1 - pin) * -35 + out * 35}deg)`;
  else tf = `translateY(${(1 - pin) * 80 - out * 60}px)`;
  return <AbsoluteFill style={{ opacity: op, transform: tf }}>{children}</AbsoluteFill>;
};

const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* লেখা আসার ধরন; মূল শব্দ রঙিন */
export const AnimText = ({ text = '', words = [], color, mode = 'rise', delay = 6, style }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const isHl = (w) => words.some((b) => b && w.indexOf(b) !== -1);
  const hlStyle = { color, background: `${color}22`, borderRadius: 14, padding: '0 10px' };
  if (mode === 'type') {
    const chars = Array.from(text), n = Math.floor(interpolate(f, [delay, delay + Math.max(12, chars.length * 1.3)], [0, chars.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    const shown = chars.slice(0, n).join('');
    const re = words.length ? new RegExp('(' + words.map(esc).join('|') + ')', 'g') : null;
    const parts = re ? shown.split(re) : [shown];
    return <div style={style}>{parts.map((p, i) => (re && words.includes(p) ? <span key={i} style={hlStyle}>{p}</span> : <span key={i}>{p}</span>))}<span style={{ opacity: f % 16 < 8 && n < chars.length ? 1 : 0 }}>|</span></div>;
  }
  if (mode === 'words' || mode === 'pop') {
    const list = String(text).split(/\s+/);
    return (
      <div style={style}>
        {list.map((w, i) => {
          const p = spring({ frame: f - delay - i * (mode === 'pop' ? 3 : 4), fps, config: { damping: mode === 'pop' ? 9 : 14 } });
          const tf = mode === 'pop' ? `scale(${0.3 + p * 0.7})` : `translateY(${(1 - p) * 40}px)`;
          return <span key={i} style={{ display: 'inline-block', marginRight: '0.28em', opacity: p, transform: tf, ...(isHl(w) ? hlStyle : {}) }}>{w}</span>;
        })}
      </div>
    );
  }
  const p = spring({ frame: f - delay, fps, config: { damping: 14, mass: 0.7 } });
  const re = words.length ? new RegExp('(' + words.map(esc).join('|') + ')', 'g') : null;
  return <div style={{ ...style, transform: `translateY(${(1 - p) * 60}px)`, opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>
    {(re ? String(text).split(re) : [text]).map((x, i) => (re && words.includes(x) ? <span key={i} style={hlStyle}>{x}</span> : <span key={i}>{x}</span>))}
  </div>;
};

/* পটভূমির বাড়তি নকশা */
export const Deco = ({ kind, t }) => {
  const f = useCurrentFrame(), { width, height } = useVideoConfig();
  if (kind === 'rings') return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: width * (0.7 - i * 0.25), top: height * (0.15 + i * 0.3), width: 360 + i * 120, height: 360 + i * 120, borderRadius: '50%',
        border: `3px solid ${t.dark ? t.line : t.primary + '33'}`, transform: `scale(${1 + Math.sin((f + i * 20) / 40) * 0.08})` }} />)}
    </AbsoluteFill>
  );
  if (kind === 'stripes') return <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(-35deg, ${t.primary}14 0 28px, transparent 28px 90px)`, backgroundPosition: `${f * 1.5}px 0` }} />;
  if (kind === 'grid') return <AbsoluteFill style={{ backgroundImage: `linear-gradient(${t.line}40 1px, transparent 1px), linear-gradient(90deg, ${t.line}40 1px, transparent 1px)`, backgroundSize: '96px 96px', transform: `translateY(${(f % 96)}px)`, opacity: 0.7 }} />;
  return null;
};
