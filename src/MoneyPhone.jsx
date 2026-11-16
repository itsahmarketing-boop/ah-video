import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { palette } from './Preview.jsx';

const BN = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);
const group = n => { const s = String(Math.round(n)); let o = '', c = 0; for (let i = s.length - 1; i >= 0; i--) { o = s[i] + o; if (++c % 3 === 0 && i) o = ',' + o; } return o; };
const taka = n => '৳ ' + BN(group(n));

// one incoming-money animation: brand-coloured wallet phone, balance counts up, a "+৳" toast springs in.
export function MoneyPhone({ brand = {}, base = 1250, incoming = 500, label = 'টাকা জমা হয়েছে' }) {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const p = palette(brand);

  // phone enters
  const inUp = spring({ frame: f, fps, config: { damping: 16, mass: 0.7 } });
  const phoneY = interpolate(inUp, [0, 1], [90, 0]);
  const phoneO = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  // toast springs from top at frame 34
  const ts = spring({ frame: f - 34, fps, config: { damping: 12, mass: 0.6 } });
  const toastY = interpolate(ts, [0, 1], [-220, 0]);
  const toastO = interpolate(f, [34, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // balance counts base -> base+incoming between 40 and 92
  const prog = interpolate(f, [40, 92], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bal = base + incoming * prog;
  // little pop on the balance when the money lands
  const pop = interpolate(f, [40, 50, 62], [1, 1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // floating coin
  const coinY = Math.sin(f / 9) * 10;
  const ring = interpolate(f, [40, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const PW = 620, PH = 1240, PX = (width - PW) / 2, PY = (height - PH) / 2 + 20;
  const bezel = p.ink, screen = '#FFFFFF';

  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 100% at 50% 8%, ${p.deep2} 0%, ${p.deep} 70%)` }}>
      {/* soft brand glow */}
      <AbsoluteFill style={{ background: `radial-gradient(45% 30% at 50% 30%, ${p.pop}33 0%, transparent 70%)` }} />

      <div style={{ position: 'absolute', left: PX, top: PY + phoneY, width: PW, height: PH, opacity: phoneO,
        background: bezel, borderRadius: 72, padding: 18, boxShadow: '0 60px 120px rgba(0,0,0,.45)' }}>
        <div style={{ width: '100%', height: '100%', background: screen, borderRadius: 56, overflow: 'hidden', position: 'relative', fontFamily: 'Noto Sans Bengali, Hind Siliguri, sans-serif' }}>
          {/* status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '26px 40px 0', color: p.sub, fontSize: 26, fontWeight: 700 }}>
            <span>{BN(9)}:{BN(41)}</span><span>৫জি ▦ ▰▰▰</span>
          </div>
          {/* app header */}
          <div style={{ margin: '26px 34px 0', background: p.primary, color: '#fff', borderRadius: 30, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: '#ffffff28', display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 900 }}>৳</div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{brand.name || 'ওয়ালেট'}</div>
              <div style={{ fontSize: 22, opacity: .85 }}>মোবাইল ওয়ালেট</div>
            </div>
          </div>
          {/* balance card */}
          <div style={{ margin: '30px 34px 0', background: p.soft, borderRadius: 30, padding: '40px 34px', textAlign: 'center' }}>
            <div style={{ color: p.sub, fontSize: 28, fontWeight: 700, marginBottom: 14 }}>বর্তমান ব্যালেন্স</div>
            <div style={{ color: p.ink, fontSize: 92, fontWeight: 900, letterSpacing: -1, transform: `scale(${pop})` }}>{taka(bal)}</div>
            <div style={{ marginTop: 18, height: 6, borderRadius: 6, background: '#e6e9f2', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${ring * 100}%`, background: p.primary }} />
            </div>
          </div>
          {/* quick actions */}
          <div style={{ display: 'flex', gap: 16, margin: '26px 34px 0' }}>
            {['পাঠান', 'রিচার্জ', 'পেমেন্ট'].map((t, i) => (
              <div key={i} style={{ flex: 1, background: '#f1f3f9', borderRadius: 22, padding: '24px 0', textAlign: 'center', color: p.ink, fontSize: 24, fontWeight: 700 }}>
                <div style={{ width: 46, height: 46, margin: '0 auto 10px', borderRadius: 14, background: p.primary + '22', display: 'grid', placeItems: 'center', color: p.primary, fontSize: 26, fontWeight: 900 }}>{['↑', '◉', '▤'][i]}</div>{t}
              </div>
            ))}
          </div>
        </div>

        {/* incoming money toast */}
        <div style={{ position: 'absolute', left: 50, right: 50, top: 60 + toastY, opacity: toastO,
          background: '#fff', borderRadius: 26, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 18,
          boxShadow: `0 24px 50px ${p.primary}55`, border: `2px solid ${p.primary}22` }}>
          <div style={{ width: 66, height: 66, borderRadius: 20, background: p.primary, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 34, fontWeight: 900, transform: `translateY(${coinY * 0.4}px)` }}>↓</div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ color: p.ink, fontSize: 30, fontWeight: 900 }}>+ {taka(incoming)}</div>
            <div style={{ color: p.sub, fontSize: 23, fontWeight: 600 }}>{label}</div>
          </div>
          <div style={{ marginLeft: 'auto', color: p.primary, fontSize: 26, fontWeight: 900 }}>●</div>
        </div>
      </div>

      {/* floating taka coins */}
      {[0, 1, 2].map(i => {
        const cf = f - (30 + i * 8);
        const o = interpolate(cf, [0, 10, 40], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const y = interpolate(cf, [0, 40], [0, -160], { extrapolateLeft: 'clamp' });
        return (
          <div key={i} style={{ position: 'absolute', left: width / 2 - 30 + (i - 1) * 90, top: PY + 120 + y, opacity: o,
            width: 70, height: 70, borderRadius: '50%', background: p.gold, color: '#5a4410', display: 'grid', placeItems: 'center', fontSize: 34, fontWeight: 900, boxShadow: '0 10px 24px rgba(0,0,0,.3)' }}>৳</div>
        );
      })}
    </AbsoluteFill>
  );
}
