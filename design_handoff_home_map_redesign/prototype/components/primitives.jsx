/* Shared primitives for the Class Companion redesign prototype */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- tone helpers ---------- */
function tone(t) {
  return { fg: `var(--t-${t})`, bg: `var(--t-${t}-bg)` };
}
function unitVar(n) { return { fg: `var(--u${n})`, bg: `var(--u${n}b)` }; }

/* ---------- icons (simple, stroked) ---------- */
const Ic = {
  flame: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c.5 3 2.5 4 3.5 5.5C16.8 10.4 17 12 17 13a5 5 0 1 1-10 0c0-1.3.5-2.6 1.3-3.5C8.7 11 9.5 11.5 10 11c.8-.8-.5-2.3 0-4 .3-1.2 1.3-3 2-4z"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>),
  trophy: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12v3a6 6 0 0 1-12 0V4z"/><path d="M6 5H4v1a3 3 0 0 0 3 3M18 5h2v1a3 3 0 0 1-3 3M9 17h6M10 17v3M14 17v3M8 21h8"/></svg>),
  cal: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>),
  chevR: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7"/></svg>),
  arrowR: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7"/></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>),
  map: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 4 6 2 5-2v14l-5 2-6-2-5 2V6l5-2z"/><path d="M9 4v14M15 6v14"/></svg>),
  home: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/></svg>),
  grid: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></svg>),
  clock: (p) => (<svg viewBox="0 0 24 24" width={p.s||14} height={p.s||14} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>),
  spark: (p) => (<svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="currentColor"><path d="M12 2.5c.4 3.8 2.2 5.6 6 6-3.8.4-5.6 2.2-6 6-.4-3.8-2.2-5.6-6-6 3.8-.4 5.6-2.2 6-6z"/></svg>),
  play: (p) => (<svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>),
  target: (p) => (<svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>),
};
function Icon({ name, s, style, className }) {
  const F = Ic[name]; if (!F) return null;
  return <span className={className} style={{ display: 'inline-flex', ...style }}>{F({ s })}</span>;
}

/* ---------- progress ring ---------- */
function Ring({ pct, size = 64, stroke = 6, color = 'var(--primary)', track = 'var(--line)', children, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.7,.3,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', lineHeight: 1 }}>
        {children ?? <span style={{ fontWeight: 700, fontSize: size*0.26 }}>{Math.round(pct)}%</span>}
      </div>
      {label && <span style={{ position:'absolute', inset:0 }} aria-label={label}></span>}
    </div>
  );
}

/* ---------- 7-day activity strip ---------- */
function WeekDots({ data, accent = 'var(--primary)' }) {
  const days = ['M','T','W','T','F','S','S'];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {data.map((on, i) => (
        <div key={i} style={{ display: 'grid', gap: 4, justifyItems: 'center' }}>
          <div style={{ width: 16, height: 16, borderRadius: 6,
            background: on ? accent : 'var(--line)',
            boxShadow: on ? '0 1px 3px rgba(176,87,64,.35)' : 'none',
            opacity: on ? 1 : .6 }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-light)' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- type glyph badge ---------- */
function TypeGlyph({ type, size = 38 }) {
  const meta = CC_DATA.TYPES[type] || CC_DATA.TYPES.guide;
  const t = tone(meta.tone);
  return (
    <span style={{ width: size, height: size, borderRadius: 12, display: 'grid', placeItems: 'center',
      background: t.bg, fontSize: size*0.46, flexShrink: 0,
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.fg} 22%, transparent)` }}>{meta.glyph}</span>
  );
}

/* ---------- small pill ---------- */
function Pill({ children, fg = 'var(--text-muted)', bg = 'var(--surface-2)', strong, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11,
      fontWeight: strong ? 700 : 600, color: fg, background: bg, padding: '4px 9px',
      borderRadius: 999, lineHeight: 1, letterSpacing: strong ? '.04em' : 0, whiteSpace: 'nowrap', ...style }}>{children}</span>
  );
}

/* ---------- soft button ---------- */
function Btn({ children, kind = 'primary', size = 'md', full, onClick, style, as = 'button', href }) {
  const pads = size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 22px' : '11px 18px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;
  const styles = {
    primary: { background: 'linear-gradient(180deg, var(--primary-light) -40%, var(--primary) 60%, var(--primary-dark) 130%)', color: '#fff', border: '1px solid color-mix(in srgb, var(--primary-dark) 70%, transparent)', boxShadow: 'var(--sh-pop)' },
    soft: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line)', boxShadow: 'var(--sh-sm)' },
    ghost: { background: 'transparent', color: 'var(--primary)', border: '1px solid transparent' },
  };
  const Comp = as;
  return (
    <Comp href={href} onClick={onClick} className="cc-focus"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: fs, padding: pads, borderRadius: 999,
        cursor: 'pointer', width: full ? '100%' : 'auto', transition: 'transform .15s ease, box-shadow .15s ease',
        textDecoration: 'none', ...styles[kind], ...style }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(.98)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}>
      {children}
    </Comp>
  );
}

/* ---------- section label (overline) ---------- */
function Overline({ children, color = 'var(--text-muted)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 22, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color }}>{children}</span>
    </div>
  );
}

Object.assign(window, { tone, unitVar, Icon, Ic, Ring, WeekDots, TypeGlyph, Pill, Btn, Overline });
