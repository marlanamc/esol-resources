/* Home pages — In-class (Weeks) and Independent (Levels) */

function withStatus(items, doneCount) {
  return items.map((it, i) => ({ ...it, status: i < doneCount ? 'done' : i === doneCount ? 'current' : 'todo' }));
}

function GreetHeader({ name, sub, emoji }) {
  return (
    <div>
      <h1 style={{ fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 500 }}>Welcome back,</span>
        <span style={{ color: 'var(--primary)', position: 'relative' }}>{name}
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: 1, height: 7, background: 'color-mix(in srgb, var(--secondary) 35%, transparent)', borderRadius: 3, transform: 'rotate(-1deg)', zIndex: -1 }} />
        </span>
        {emoji && <span style={{ fontSize: 22 }}>{emoji}</span>}
      </h1>
      <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
}

/* primary "journey" panel used on both homes */
function JourneyPanel({ overline, oColor, title, sub, goal, items, progress, styleVariant, accent, device, ctaLabel, mapLabel }) {
  return (
    <div className="cc-card" style={{ overflow: 'hidden' }}>
      {/* header band tinted with unit/level accent */}
      <div style={{ padding: device==='mobile' ? '16px 16px 14px' : '20px 22px 16px',
        background: `linear-gradient(135deg, ${accent.bg}, transparent)`, borderBottom: '1px solid var(--line-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <Overline color={oColor}>{overline}</Overline>
            <h2 style={{ fontSize: device==='mobile'?20:23, marginTop: 8, lineHeight: 1.15 }}>{title}</h2>
            {goal && <p style={{ margin: '7px 0 0', fontSize: 13, color: 'var(--text-muted)', maxWidth: 460, lineHeight: 1.45, textWrap: 'balance' }}>{goal}</p>}
          </div>
          <Ring pct={progress.pct} size={device==='mobile'?52:60} stroke={6} color={accent.fg} track="var(--bg-deep)">
            <span style={{ fontWeight: 800, fontSize: device==='mobile'?12:13 }}>{progress.pct}%</span>
          </Ring>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <Pill fg={accent.fg} bg={accent.bg} strong style={{ fontSize: 11 }}>{progress.done} of {progress.total} done</Pill>
          {sub && <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{sub}</span>}
        </div>
      </div>
      {/* journey body */}
      <div style={{ padding: device==='mobile' ? '18px 14px' : '24px 22px' }}>
        <Journey items={items} styleVariant={styleVariant} accent={accent} device={device} />
      </div>
      {/* footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        padding: device==='mobile' ? '0 14px 16px' : '0 22px 20px' }}>
        <Btn kind="primary" size={device==='mobile'?'md':'md'} style={{ background: `linear-gradient(180deg, color-mix(in srgb,${accent.fg} 80%, #fff) -30%, ${accent.fg} 70%)`, boxShadow: `0 8px 18px color-mix(in srgb, ${accent.fg} 30%, transparent)` }}>
          <Icon name="play" s={14} />{ctaLabel}
        </Btn>
        <a className="cc-focus" style={{ fontSize: 12.5, fontWeight: 700, color: accent.fg, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          {mapLabel}<Icon name="chevR" s={15} />
        </a>
      </div>
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', borderRadius: 16,
      background: 'linear-gradient(135deg, #fbf2e3, var(--surface))', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' }}>
      <span style={{ fontSize: 20 }}>📣</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Mrs. P:</span>{' '}
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Great work last week! This week we start <b style={{ color: 'var(--text)' }}>Housing</b> — finish the quiz by Thursday. 🏠</span>
      </div>
    </div>
  );
}

function SidebarCard({ title, action, children, pad = 18 }) {
  return (
    <div className="cc-card" style={{ padding: pad }}>
      {title && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>{title}</h3>
        {action && <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}>{action}</span>}
      </div>}
      {children}
    </div>
  );
}

/* ============================ IN-CLASS HOME ============================ */
function InClassHome({ device, styleVariant }) {
  const st = CC_DATA.STATE.inClass;
  const unit = CC_DATA.UNITS[st.currentUnit - 1];
  const week = unit.weeks.find(w => w.n === st.currentWeek);
  const done = st.weekDone[st.currentWeek] || 0;
  const items = withStatus(week.items, done);
  const accent = unitVar(unit.n);
  const progress = { done, total: week.items.length, pct: Math.round(done / week.items.length * 100) };
  const mobile = device === 'mobile';

  const panel = (
    <JourneyPanel overline={`This week · Week ${week.n}`} oColor={accent.fg}
      title={week.title} goal={week.goal} progress={progress}
      sub={st.weekRange} items={items} styleVariant={styleVariant} accent={accent} device={device}
      ctaLabel="Continue" mapLabel="Full map" />
  );

  if (mobile) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 18 }}>
        <MomentumCard st={st} />
        <GreetHeader name={st.name} emoji="🙋🏻‍♀️" sub={`${st.weekRange} · You're doing great!`} />
        <AnnouncementBar />
        {panel}
        <SpotlightStrip variant="inclass" device={device} />
        <div>
          <Overline color="var(--text-muted)">Explore activities</Overline>
          <div style={{ marginTop: 12 }}><CategoryGrid device={device} /></div>
        </div>
        <SidebarCard title="Upcoming" action="Calendar →"><UpcomingList /></SidebarCard>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <AnnouncementBar />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 322px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18, minWidth: 0 }}>
          <GreetHeader name={st.name} emoji="🙋🏻‍♀️" sub={`${st.weekRange} · You're doing great!`} />
          {panel}
          <SpotlightStrip variant="inclass" device={device} />
          <SidebarCard title="Explore activities" action="Browse all →"><CategoryGrid device={device} /></SidebarCard>
        </div>
        <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 80 }}>
          <MomentumCard st={st} />
          <div className="cc-card" style={{ padding: 18 }}>
            <MiniCalendar />
            <div style={{ height: 1, background: 'var(--line-soft)', margin: '15px 0' }} />
            <UpcomingList />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================ INDEPENDENT HOME ============================ */
function IndependentHome({ device, styleVariant }) {
  const st = CC_DATA.STATE.independent;
  const level = CC_DATA.LEVELS[st.currentLevel - 1];
  const totalDone = 6; // items completed in this level
  const allItems = withStatus(level.items, totalDone);
  // home shows a focused window: current + next few
  const windowItems = allItems.slice(totalDone, totalDone + (device === 'mobile' ? 4 : 5));
  const accent = unitVar(level.n);
  const progress = { done: totalDone, total: level.items.length, pct: Math.round(totalDone / level.items.length * 100) };
  const mobile = device === 'mobile';

  const panel = (
    <JourneyPanel overline={`Your path · Level ${level.n}`} oColor={accent.fg}
      title={level.name} goal={`Self-paced — pick up where you left off.`} progress={progress}
      sub={`${level.items.length - totalDone} to go`} items={windowItems} styleVariant={styleVariant} accent={accent} device={device}
      ctaLabel="Continue learning" mapLabel="Level map" />
  );

  if (mobile) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 18 }}>
        <LevelMomentumCard st={st} />
        <GreetHeader name={st.name} sub="Learning at your own pace 🌱" />
        {panel}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          <WeeklyGoalCard st={st} />
          <LeaderboardCard st={st} />
        </div>
        <SpotlightStrip variant="independent" device={device} />
        <div>
          <Overline color="var(--text-muted)">Explore activities</Overline>
          <div style={{ marginTop: 12 }}><CategoryGrid device={device} /></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 322px', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'grid', gap: 18, minWidth: 0 }}>
        <GreetHeader name={st.name} sub="Learning at your own pace 🌱" />
        {panel}
        <SpotlightStrip variant="independent" device={device} />
        <SidebarCard title="Explore activities" action="Browse all →"><CategoryGrid device={device} /></SidebarCard>
      </div>
      <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 80 }}>
        <LevelMomentumCard st={st} />
        <WeeklyGoalCard st={st} />
        <LeaderboardCard st={st} />
      </aside>
    </div>
  );
}

Object.assign(window, { InClassHome, IndependentHome, withStatus, JourneyPanel });
