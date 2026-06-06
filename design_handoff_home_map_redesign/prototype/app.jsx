/* App shell — review chrome (page tabs, device toggle, path-style switch) + device frames */

const PAGES = [
  { key: 'ic-home', label: 'In-class · Home', mode: 'inclass', tab: 'home' },
  { key: 'ic-map',  label: 'In-class · Map',  mode: 'inclass', tab: 'map' },
  { key: 'in-home', label: 'Independent · Home', mode: 'independent', tab: 'home' },
  { key: 'in-map',  label: 'Independent · Map',  mode: 'independent', tab: 'map' },
];
const STYLES = [
  { key: 'trail', label: 'Trail' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'stones', label: 'Stepping stones' },
];

function load(k, d) { try { return JSON.parse(localStorage.getItem('cc_' + k)) ?? d; } catch { return d; } }
function save(k, v) { try { localStorage.setItem('cc_' + k, JSON.stringify(v)); } catch {} }

function Seg({ options, value, onChange, accent }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: 3, gap: 2 }}>
      {options.map(o => {
        const on = o.key === value;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} className="cc-focus" style={{ padding: '6px 13px', borderRadius: 999, border: 'none',
            fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap',
            background: on ? 'var(--surface)' : 'transparent', color: on ? (accent || 'var(--primary)') : 'var(--text-muted)',
            boxShadow: on ? 'var(--sh-sm)' : 'none', transition: 'all .15s' }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function ControlBar({ page, setPage, device, setDevice, sv, setSv, hideLocked, setHideLocked }) {
  const isMap = page === 'ic-map';
  return (
    <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', boxShadow: 'var(--sh-sm)', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '11px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(150deg, var(--primary-light), var(--primary))', display: 'grid', placeItems: 'center', fontSize: 13 }}>📚</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Class Companion <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>· redesign</span></span>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 4 }}>
          {PAGES.map(p => {
            const on = p.key === page;
            return (
              <button key={p.key} onClick={() => setPage(p.key)} className="cc-focus" style={{ padding: '7px 13px', borderRadius: 9, border: 'none',
                fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap',
                background: on ? 'var(--primary)' : 'transparent', color: on ? '#fff' : 'var(--text-muted)',
                boxShadow: on ? 'var(--sh-pop)' : 'none', transition: 'all .15s' }}>{p.label}</button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {isMap && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
              Future weeks
              <Seg options={[{key:'locked',label:'Show locked'},{key:'hidden',label:'Hide'}]} value={hideLocked} onChange={setHideLocked} />
            </label>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
            Path style
            <Seg options={STYLES} value={sv} onChange={setSv} accent="var(--secondary-dark)" />
          </label>
          <Seg options={[{key:'desktop',label:'🖥 Desktop'},{key:'mobile',label:'📱 Mobile'}]} value={device} onChange={setDevice} />
        </div>
      </div>
    </div>
  );
}

function PageBody({ page, device, sv, hideLocked }) {
  const cfg = PAGES.find(p => p.key === page);
  const props = { device, styleVariant: sv };
  if (page === 'ic-home') return <InClassHome {...props} />;
  if (page === 'in-home') return <IndependentHome {...props} />;
  if (page === 'ic-map') return <InClassMap {...props} hideLocked={hideLocked} />;
  if (page === 'in-map') return <IndependentMap {...props} />;
  return null;
}

function AppFrame({ page, device, sv, hideLocked }) {
  const cfg = PAGES.find(p => p.key === page);
  const contentMax = 1180;
  const content = (
    <div className="paper cc-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      <AppBar device={device} page={page} mode={cfg.mode} />
      <div style={{ maxWidth: contentMax, margin: '0 auto', padding: device === 'mobile' ? '18px 16px 28px' : '24px 26px 40px' }}>
        <PageBody page={page} device={device} sv={sv} hideLocked={hideLocked} />
      </div>
    </div>
  );

  if (device === 'mobile') {
    return (
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', placeItems: 'center', padding: 20 }}>
        <div style={{ width: 402, maxWidth: '100%', height: 'min(840px, calc(100vh - 150px))', background: '#211a14', borderRadius: 46, padding: 11,
          boxShadow: '0 30px 70px rgba(40,31,23,.34), inset 0 0 0 2px rgba(255,255,255,.06)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg)' }}>
            <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 116, height: 26, background: '#211a14', borderRadius: 999, zIndex: 60 }} />
            {content}
            <BottomNav active={cfg.tab} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', padding: '18px 18px 0', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1320, display: 'flex', flexDirection: 'column', borderRadius: '18px 18px 0 0', overflow: 'hidden',
        border: '1px solid var(--line)', borderBottom: 'none', boxShadow: 'var(--sh-lg)' }}>
        {content}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(() => load('page', 'ic-home'));
  const [device, setDevice] = useState(() => load('device', 'desktop'));
  const [sv, setSv] = useState(() => load('sv', 'timeline'));
  const [hideLocked, setHideLocked] = useState(() => load('hideLocked', 'locked'));
  useEffect(() => save('page', page), [page]);
  useEffect(() => save('device', device), [device]);
  useEffect(() => save('sv', sv), [sv]);
  useEffect(() => save('hideLocked', hideLocked), [hideLocked]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
      <ControlBar page={page} setPage={setPage} device={device} setDevice={setDevice}
        sv={sv} setSv={setSv} hideLocked={hideLocked} setHideLocked={setHideLocked} />
      <AppFrame page={page} device={device} sv={sv} hideLocked={hideLocked} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
