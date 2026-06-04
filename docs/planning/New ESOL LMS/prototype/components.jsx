// =========================================================
// Shared components: app context, phone shell, nav, controls
// =========================================================
const { useState, useEffect, useRef, useContext, createContext, useCallback } = React;
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// Count a number up from 0 -> target on mount (respects reduced-motion)
function useCountUp(target, ms = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

// Returns true a tick after mount — used to trigger CSS enter transitions
function useEnter(delay = 20) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, []);
  return on;
}

// ---------- Status bar ----------
function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span className="sb-time display">9:41</span>
      <div className="sb-right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5c2 0 3.8.8 5 2.1l1.3-1.4A9 9 0 0 0 8 .6 9 9 0 0 0 1.7 3.2L3 4.6A6.9 6.9 0 0 1 8 2.5z"/><path d="M8 6c1 0 2 .4 2.7 1.1l1.3-1.4A6 6 0 0 0 8 4a6 6 0 0 0-4 1.7l1.3 1.4A4 4 0 0 1 8 6z"/><circle cx="8" cy="10" r="1.6"/></svg>
        <span className="sb-batt"><span className="sb-batt-fill"></span></span>
      </div>
    </div>
  );
}

// ---------- Phone shell ----------
function PhoneShell({ children, nav, scrollRef }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <StatusBar />
        <div className="phone-scroll" ref={scrollRef}>{children}</div>
        {nav}
      </div>
      <div className="phone-notch" aria-hidden="true"></div>
    </div>
  );
}

// ---------- Bottom nav ----------
const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "track", label: "Track", icon: "compass" },
  { id: "browse", label: "Browse", icon: "browse" },
  { id: "progress", label: "You", icon: "trophy" },
];
function BottomNav() {
  const { screen, go } = useApp();
  return (
    <nav className="bottomnav" aria-label="Main">
      {NAV.map((n) => {
        const active = screen === n.id || (n.id === "browse" && screen === "activity");
        return (
          <button key={n.id} className={"navbtn" + (active ? " is-active" : "")} onClick={() => go(n.id)}>
            <span className="navbtn-ico"><Icon name={n.icon} size={24} fill={active} stroke={active ? 0 : 1.9} /></span>
            <span className="navbtn-lbl">{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ---------- Control bar (style + mode switcher, outside phone) ----------
const STYLES = [
  { id: "hearth", name: "Hearth", tag: "Warm & refined" },
  { id: "bloom", name: "Bloom", tag: "Bold & playful" },
  { id: "quiet", name: "Quiet", tag: "Calm & minimal" },
];
function ControlBar() {
  const { style, setStyle, mode, setMode, device, setDevice } = useApp();
  return (
    <div className="controlbar">
      <div className="cb-brand">
        <div className="cb-logo"><Icon name="sparkles" size={18} /></div>
        <div className="cb-titles">
          <div className="cb-title">Self-Directed ESOL</div>
          <div className="cb-sub">Three style directions · tap to compare</div>
        </div>
      </div>
      <div className="cb-segs" role="tablist" aria-label="Style direction">
        {STYLES.map((s) => (
          <button key={s.id} role="tab" aria-selected={style === s.id}
            className={"cb-seg" + (style === s.id ? " is-on" : "")} onClick={() => setStyle(s.id)}>
            <span className="cb-seg-name">{s.name}</span>
            <span className="cb-seg-tag">{s.tag}</span>
          </button>
        ))}
      </div>
      <div className="cb-device" role="tablist" aria-label="Device">
        <button role="tab" aria-selected={device === "mobile"} className={"cb-dev" + (device === "mobile" ? " is-on" : "")} onClick={() => setDevice("mobile")}>Phone</button>
        <button role="tab" aria-selected={device === "desktop"} className={"cb-dev" + (device === "desktop" ? " is-on" : "")} onClick={() => setDevice("desktop")}>Desktop</button>
      </div>
      <button className="cb-mode" onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label="Toggle light or dark">
        <Icon name={mode === "light" ? "moon" : "sun"} size={18} />
        <span>{mode === "light" ? "Dark" : "Light"}</span>
      </button>
    </div>
  );
}

// ---------- Small reusable pieces ----------
function ProgressRing({ value = 0, size = 56, stroke = 6, color = "var(--primary)", track = "var(--sunken)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(value); return; }
    const t = setTimeout(() => setV(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  const off = c - (Math.max(0, Math.min(100, v)) / 100) * c;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset .6s var(--ease)" }} />
      </svg>
      {children && <div className="ring-mid">{children}</div>}
    </div>
  );
}

function CatBadge({ tone, size = 44, icon }) {
  return (
    <span className="catbadge" style={{ "--cat": `var(--cat-${tone})`, width: size, height: size }}>
      <Icon name={icon || CAT_ICON[tone] || "star"} size={size * 0.5} stroke={2} />
    </span>
  );
}

function Bar({ value, tone = "primary" }) {
  const col = tone === "primary" ? "var(--primary)" : `var(--cat-${tone})`;
  return (
    <div className="bar"><div className="bar-fill" style={{ width: `${value}%`, background: col }} /></div>
  );
}

function SectionHead({ title, action, onAction }) {
  return (
    <div className="sechead">
      <h2 className="sechead-title display">{title}</h2>
      {action && <button className="sechead-act" onClick={onAction}>{action}<Icon name="chevron" size={14} stroke={2.2} /></button>}
    </div>
  );
}

// ---------- Reward toast ----------
function RewardToast({ data, onClose, desktop }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3600);
    return () => clearTimeout(t);
  }, [data, onClose]);
  if (!data) return null;
  return (
    <div className={"toast-wrap" + (desktop ? " toast-wrap--desk" : "")}>
      <div className="toast">
        <div className="toast-burst" style={{ "--cat": `var(--cat-${data.tone || "vocab"})` }}>
          <Icon name={data.icon || "medal"} size={26} stroke={2} />
        </div>
        <div className="toast-body">
          <div className="toast-kicker">{data.kicker || "Achievement unlocked"}</div>
          <div className="toast-name display">{data.name}</div>
          {data.desc && <div className="toast-desc">{data.desc}</div>}
        </div>
        <button className="toast-x" onClick={onClose} aria-label="Dismiss"><Icon name="x" size={16} stroke={2.2} /></button>
      </div>
    </div>
  );
}

Object.assign(window, {
  AppCtx, useApp, useCountUp, useEnter, PhoneShell, BottomNav, ControlBar, StatusBar,
  ProgressRing, CatBadge, Bar, SectionHead, RewardToast, STYLES,
});
