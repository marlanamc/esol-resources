/* Course Map pages — In-class (Weeks, gated) and Independent (Levels, open) */

/* overall progress helper */
function MapProgressCard({ pct, doneN, totalN, unitLabel }) {
  return (
    <div className="cc-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Ring pct={pct} size={66} stroke={7} color="var(--primary)" track="var(--bg-deep)">
          <span style={{ fontWeight: 800, fontSize: 16 }}>{pct}%</span>
        </Ring>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{doneN} <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: 13 }}>/ {totalN} {unitLabel}</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{pct}% complete · keep climbing</div>
        </div>
      </div>
    </div>
  );
}

/* sidebar unit/level nav */
function MapNav({ entries, currentN, label }) {
  return (
    <div className="cc-card" style={{ padding: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', padding: '6px 8px 8px' }}>{label}</div>
      <div style={{ display: 'grid', gap: 2 }}>
        {entries.map(e => {
          const a = unitVar(e.n);
          const active = e.n === currentN;
          return (
            <div key={e.n} className="cc-focus" tabIndex={0} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', borderRadius: 11,
              cursor: 'pointer', background: active ? a.bg : 'transparent', transition: 'background .15s' }}
              onMouseEnter={ev => { if(!active) ev.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={ev => { if(!active) ev.currentTarget.style.background = 'transparent'; }}>
              <span style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800,
                background: e.status==='locked' ? 'var(--bg-deep)' : a.fg, color: e.status==='locked' ? 'var(--text-light)' : '#fff' }}>
                {e.status==='done' ? <Icon name="check" s={13} /> : e.status==='locked' ? <Icon name="lock" s={11} /> : e.n}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: active ? 700 : 600, color: e.status==='locked' ? 'var(--text-light)' : 'var(--text)', lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-light)', marginTop: 1 }}>{e.meta}</div>
              </div>
              {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.fg }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Unit number badge */
function UnitBadge({ n, status, size = 44 }) {
  const a = unitVar(n);
  return (
    <div style={{ width: size, height: size, borderRadius: 14, flexShrink: 0, display: 'grid', placeItems: 'center', position: 'relative',
      background: status==='locked' ? 'var(--bg-deep)' : `linear-gradient(150deg, color-mix(in srgb, ${a.fg} 78%, #fff), ${a.fg})`,
      color: status==='locked' ? 'var(--text-light)' : '#fff', boxShadow: status==='locked' ? 'none' : `0 5px 12px color-mix(in srgb, ${a.fg} 32%, transparent)` }}>
      {status==='locked' ? <Icon name="lock" s={18} /> : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size*0.42 }}>{n}</span>}
      {status==='done' && <span style={{ position: 'absolute', bottom: -3, right: -3, width: 18, height: 18, borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'grid', placeItems: 'center', border: '2px solid var(--surface)' }}><Icon name="check" s={10} /></span>}
    </div>
  );
}

function StatusChip({ status }) {
  if (status === 'done') return <Pill fg="var(--secondary-dark)" bg="#e9f0ea" strong style={{ fontSize: 10.5 }}><Icon name="check" s={12} />Completed</Pill>;
  if (status === 'current') return <Pill fg="var(--primary)" bg="#fbeae4" strong style={{ fontSize: 10.5 }}>In progress</Pill>;
  if (status === 'locked') return <Pill fg="var(--text-light)" bg="var(--bg-deep)" strong style={{ fontSize: 10.5 }}><Icon name="lock" s={11} />Locked</Pill>;
  return <Pill fg="var(--text-muted)" bg="var(--surface-2)" strong style={{ fontSize: 10.5 }}>Available</Pill>;
}

/* a collapsible Unit section for the in-class map */
function InClassUnitSection({ unit, currentWeek, releasedThrough, defaultOpen, styleVariant, device, hideLocked }) {
  const weeks = unit.weeks.map(w => ({
    ...w,
    status: w.n < currentWeek ? 'done' : w.n === currentWeek ? 'current' : w.n <= releasedThrough ? 'todo' : 'locked',
  }));
  const unitStatus = weeks.every(w => w.status === 'done') ? 'done'
    : weeks.some(w => w.status === 'current' || w.status === 'todo') ? 'current'
    : weeks.every(w => w.status === 'locked') ? 'locked' : 'current';
  const [open, setOpen] = useState(defaultOpen);
  const a = unitVar(unit.n);
  const totalW = weeks.length, doneW = weeks.filter(w => w.status==='done').length;
  const visibleWeeks = hideLocked === 'hidden' ? weeks.filter(w => w.status !== 'locked') : weeks;

  // When hiding locked content, a fully-locked unit collapses to a slim teaser.
  if (hideLocked === 'hidden' && unitStatus === 'locked') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 18,
        border: '1px dashed var(--line)', background: 'transparent', opacity: .85 }}>
        <UnitBadge n={unit.n} status="locked" size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-light)' }}>{unit.month} · {unit.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-light)', marginTop: 1 }}>Unlocks when your teacher releases it</div>
        </div>
        <Icon name="lock" s={15} style={{ color: 'var(--text-light)' }} />
      </div>
    );
  }

  return (
    <div className="cc-card" style={{ overflow: 'hidden', opacity: unitStatus==='locked' ? .92 : 1 }}>
      <button onClick={() => setOpen(!open)} className="cc-focus" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: device==='mobile' ? '14px 14px' : '16px 18px', background: open ? `linear-gradient(135deg, ${a.bg}, transparent)` : 'transparent', textAlign: 'left' }}>
        <UnitBadge n={unit.n} status={unitStatus} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: a.fg }}>{unit.month}</span>
            <StatusChip status={unitStatus} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: device==='mobile'?15:17, marginTop: 3, lineHeight: 1.15 }}>{unit.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{doneW}/{totalW} weeks{unitStatus==='locked' ? ' · unlocks soon' : ''}</div>
        </div>
        <span style={{ color: 'var(--text-light)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}><Icon name="chevR" s={20} /></span>
      </button>
      {open && (
        <div style={{ padding: device==='mobile' ? '4px 14px 16px' : '4px 18px 18px', display: 'grid', gap: 10 }}>
          {visibleWeeks.map(w => <InClassWeekRow key={w.n} week={w} accent={a} styleVariant={styleVariant} device={device} />)}
          {hideLocked === 'hidden' && visibleWeeks.length < weeks.length && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', fontSize: 11.5, fontWeight: 600,
              color: 'var(--text-light)', borderRadius: 12, border: '1px dashed var(--line)' }}>
              <Icon name="lock" s={13} />{weeks.length - visibleWeeks.length} more week{weeks.length - visibleWeeks.length>1?'s':''} unlock soon
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InClassWeekRow({ week, accent, styleVariant, device }) {
  const isCurrent = week.status === 'current';
  const [open, setOpen] = useState(isCurrent);
  const locked = week.status === 'locked';
  const done = week.status === 'done';
  const items = withStatus(week.items, done ? week.items.length : isCurrent ? (CC_DATA.STATE.inClass.weekDone[week.n] || 0) : 0);

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${isCurrent ? `color-mix(in srgb, ${accent.fg} 32%, transparent)` : 'var(--line)'}`,
      background: isCurrent ? accent.bg : 'var(--surface)', overflow: 'hidden', opacity: locked ? .6 : 1 }}>
      <button disabled={locked} onClick={() => !locked && setOpen(!open)} className="cc-focus" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 13px', textAlign: 'left', cursor: locked ? 'default' : 'pointer', background: 'transparent' }}>
        <span style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 11.5, fontWeight: 800,
          background: done ? 'var(--secondary)' : locked ? 'var(--bg-deep)' : isCurrent ? accent.fg : 'var(--surface-2)',
          color: done || isCurrent ? '#fff' : 'var(--text-light)', border: (!done && !isCurrent && !locked) ? '1px solid var(--line)' : 'none' }}>
          {done ? <Icon name="check" s={14} /> : locked ? <Icon name="lock" s={12} /> : week.n}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, color: locked ? 'var(--text-light)' : 'var(--text)' }}>
            <span style={{ color: 'var(--text-light)', fontWeight: 600, marginRight: 6 }}>Week {week.n}</span>{week.title}
          </div>
          {isCurrent && <div style={{ fontSize: 11, color: accent.fg, fontWeight: 700, marginTop: 2 }}>You're here</div>}
        </div>
        {!locked && <span style={{ color: 'var(--text-light)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}><Icon name="chevR" s={17} /></span>}
      </button>
      {open && !locked && (
        <div style={{ padding: device==='mobile' ? '6px 12px 14px' : '8px 16px 16px' }}>
          {week.goal && <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>{week.goal}</p>}
          <Journey items={items} styleVariant={styleVariant} accent={accent} device={device} />
        </div>
      )}
    </div>
  );
}

/* ============================ IN-CLASS MAP ============================ */
function InClassMap({ device, styleVariant, hideLocked = 'locked' }) {
  const st = CC_DATA.STATE.inClass;
  const units = CC_DATA.UNITS;
  // overall
  let total = 0, done = 0;
  units.forEach(u => u.weeks.forEach(w => { total++; if (w.n < st.currentWeek) done++; }));
  const pct = Math.round(done / total * 100);

  const navEntries = units.map(u => {
    const status = u.weeks.every(w => w.n < st.currentWeek) ? 'done'
      : u.weeks.some(w => w.n === st.currentWeek || (w.n > st.currentWeek && w.n <= st.releasedThroughWeek)) ? 'current'
      : u.weeks.every(w => w.n > st.releasedThroughWeek) ? 'locked' : 'current';
    return { n: u.n, title: u.title, meta: u.month, status };
  });

  const sections = units.map((u, i) => (
    <InClassUnitSection key={u.n} unit={u} currentWeek={st.currentWeek} releasedThrough={st.releasedThroughWeek}
      defaultOpen={u.n === st.currentUnit} styleVariant={styleVariant} device={device} hideLocked={hideLocked} />
  ));

  if (device === 'mobile') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Course Map</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Your week-by-week path. New weeks unlock as your teacher releases them.</p>
        </div>
        <MapProgressCard pct={pct} doneN={done} totalN={total} unitLabel="weeks" />
        {/* unit chip scroller */}
        <div className="cc-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {navEntries.map(e => { const a = unitVar(e.n); return (
            <div key={e.n} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
              background: e.n===st.currentUnit ? a.fg : a.bg, color: e.n===st.currentUnit ? '#fff' : a.fg, fontSize: 12, fontWeight: 700 }}>
              {e.status==='done' && <Icon name="check" s={12} />}{e.status==='locked' && <Icon name="lock" s={11} />}{e.month || e.meta}
            </div>); })}
        </div>
        <div style={{ display: 'grid', gap: 12 }}>{sections}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 24, alignItems: 'start' }}>
      <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 80 }}>
        <div>
          <h1 style={{ fontSize: 27 }}>Course Map</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Your week-by-week path</p>
        </div>
        <MapProgressCard pct={pct} doneN={done} totalN={total} unitLabel="weeks" />
        <MapNav entries={navEntries} currentN={st.currentUnit} label="Units" />
      </aside>
      <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>{sections}</div>
    </div>
  );
}

/* ============================ INDEPENDENT MAP ============================ */
function IndependentLevelSection({ level, status, defaultOpen, styleVariant, device, doneCount }) {
  const [open, setOpen] = useState(defaultOpen);
  const a = unitVar(level.n);
  const items = withStatus(level.items, status==='done' ? level.items.length : doneCount);
  const doneN = items.filter(i => i.status==='done').length;

  return (
    <div className="cc-card" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} className="cc-focus" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: device==='mobile' ? '14px 14px' : '16px 18px', background: open ? `linear-gradient(135deg, ${a.bg}, transparent)` : 'transparent', textAlign: 'left' }}>
        <UnitBadge n={level.n} status={status==='done'?'done':'open'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: a.fg }}>Level {level.n}</span>
            <StatusChip status={status} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: device==='mobile'?15:17, marginTop: 3, lineHeight: 1.15 }}>{level.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{doneN}/{level.items.length} activities · {Math.round(doneN/level.items.length*100)}%</div>
        </div>
        <span style={{ color: 'var(--text-light)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}><Icon name="chevR" s={20} /></span>
      </button>
      {open && (
        <div style={{ padding: device==='mobile' ? '8px 14px 18px' : '10px 20px 22px' }}>
          <Journey items={items} styleVariant={styleVariant} accent={a} device={device} />
        </div>
      )}
    </div>
  );
}

function IndependentMap({ device, styleVariant }) {
  const st = CC_DATA.STATE.independent;
  const levels = CC_DATA.LEVELS;
  const doneInCurrent = 6;
  // overall progress across levels
  let total = 0, done = 0;
  levels.forEach(l => { total += l.items.length; if (l.n < st.currentLevel) done += l.items.length; });
  done += doneInCurrent;
  const pct = Math.round(done / total * 100);

  const statusOf = (n) => n < st.currentLevel ? 'done' : n === st.currentLevel ? 'current' : 'todo';
  const navEntries = levels.map(l => ({ n: l.n, title: l.name, meta: `Level ${l.n}`, status: statusOf(l.n) }));

  const sections = levels.map(l => (
    <IndependentLevelSection key={l.n} level={l} status={statusOf(l.n)} defaultOpen={l.n === st.currentLevel}
      styleVariant={styleVariant} device={device} doneCount={l.n < st.currentLevel ? l.items.length : l.n === st.currentLevel ? doneInCurrent : 0} />
  ));

  if (device === 'mobile') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Level Map</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>All levels are open — move at your own pace.</p>
        </div>
        <MapProgressCard pct={pct} doneN={done} totalN={total} unitLabel="activities" />
        <div className="cc-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {navEntries.map(e => { const a = unitVar(e.n); return (
            <div key={e.n} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
              background: e.n===st.currentLevel ? a.fg : a.bg, color: e.n===st.currentLevel ? '#fff' : a.fg, fontSize: 12, fontWeight: 700 }}>
              {e.status==='done' && <Icon name="check" s={12} />}Lvl {e.n}
            </div>); })}
        </div>
        <div style={{ display: 'grid', gap: 12 }}>{sections}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 24, alignItems: 'start' }}>
      <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 80 }}>
        <div>
          <h1 style={{ fontSize: 27 }}>Level Map</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Self-paced · all levels open</p>
        </div>
        <MapProgressCard pct={pct} doneN={done} totalN={total} unitLabel="activities" />
        <MapNav entries={navEntries} currentN={st.currentLevel} label="Levels" />
        <LevelMomentumCard st={st} />
      </aside>
      <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>{sections}</div>
    </div>
  );
}

Object.assign(window, { InClassMap, IndependentMap });
