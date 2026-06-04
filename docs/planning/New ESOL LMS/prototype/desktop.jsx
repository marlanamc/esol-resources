// =========================================================
// Desktop layout — sidebar + multi-column dashboard
// Reuses MomentumCard, DailyGoalCard, CatBadge, ProgressRing, Bar
// =========================================================

const DESK_NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "track", label: "My Track", icon: "compass" },
  { id: "browse", label: "Browse", icon: "browse" },
  { id: "progress", label: "Progress", icon: "trophy" },
];

function DesktopSidebar() {
  const { screen, go } = useApp();
  return (
    <aside className="desk-side">
      <div className="desk-brand">
        <span className="desk-logo"><Icon name="sparkles" size={20} /></span>
        <span className="desk-brandname display">ESOL Path</span>
      </div>
      <nav className="desk-nav">
        {DESK_NAV.map((n) => {
          const active = screen === n.id || (n.id === "browse" && screen === "activity");
          return (
            <button key={n.id} className={"desk-navitem" + (active ? " is-active" : "")} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={20} fill={active} stroke={active ? 0 : 1.9} />
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="desk-side-foot">
        <button className="desk-profile" onClick={() => go("progress")}>
          <span className="desk-avatar display">{LEARNER.initial}</span>
          <span className="desk-profile-txt">
            <span className="desk-profile-name">{LEARNER.name}</span>
            <span className="desk-profile-sub">Level {LEARNER.level} · {LEARNER.levelTitle}</span>
          </span>
        </button>
      </div>
    </aside>
  );
}

function DesktopTopbar() {
  return (
    <header className="desk-top">
      <div className="desk-greet">
        <div className="desk-hi">Good evening</div>
        <h1 className="desk-name display">Welcome back, {LEARNER.name}</h1>
      </div>
      <div className="desk-top-actions">
        <div className="desk-search"><Icon name="search" size={18} /><span>Search activities & words…</span></div>
        <span className="streakpill" title="Day streak"><Icon name="flame" size={17} fill stroke={0} /><b>{LEARNER.streak}</b></span>
        <button className="iconbtn" aria-label="Notifications"><Icon name="bell" size={20} /><span className="bell-dot" /></button>
      </div>
    </header>
  );
}

// Compact roadmap for the rail
function DesktopTrackMini() {
  const { go } = useApp();
  const total = STAGES.reduce((a, s) => a + s.items.length, 0);
  const done = STAGES.reduce((a, s) => a + s.items.filter(i => i.done).length, 0);
  return (
    <section className="railcard">
      <div className="railcard-head">
        <h3 className="railcard-title display">Your track</h3>
        <button className="railcard-link" onClick={() => go("track")}>Full map <Icon name="chevron" size={13} stroke={2.2} /></button>
      </div>
      <div className="dtrack">
        {STAGES.map((s, i) => {
          const sd = s.items.filter(x => x.done).length;
          const complete = sd === s.items.length;
          const current = !complete && s.items.some(x => x.done || x.current);
          return (
            <button key={s.n} className={"dtrack-row" + (complete ? " ok" : current ? " now" : "")} onClick={() => go("track")}>
              <span className="dtrack-node">{complete ? <Icon name="check" size={13} stroke={2.6} /> : s.n}</span>
              <span className="dtrack-txt">
                <span className="dtrack-name">{s.title}</span>
                <span className="dtrack-sub">{sd}/{s.items.length} done</span>
              </span>
              {current && <span className="dtrack-now">Now</span>}
            </button>
          );
        })}
      </div>
      <div className="dtrack-foot"><Bar value={Math.round((done/total)*100)} tone="primary" /><span>{done}/{total}</span></div>
    </section>
  );
}

function DesktopAwardPeek() {
  const { go, fireReward } = useApp();
  const near = ACHIEVEMENTS.find(a => !a.earned && a.progress);
  return (
    <section className="railcard">
      <div className="railcard-head">
        <h3 className="railcard-title display">Almost there</h3>
        <button className="railcard-link" onClick={() => go("progress")}>All awards <Icon name="chevron" size={13} stroke={2.2} /></button>
      </div>
      <div className="nearaward shimmer" style={{ "--cat": `var(--cat-${near.tone})` }}
        onClick={() => fireReward({ name: near.name, desc: near.desc, icon: near.icon, tone: near.tone, kicker: "Preview reward" })}>
        <span className="nearaward-ico"><Icon name={near.icon} size={24} stroke={2} /></span>
        <div className="nearaward-txt">
          <div className="nearaward-name">{near.name}</div>
          <div className="nearaward-sub">{near.desc}</div>
          <Bar value={near.progress} tone={near.tone} />
        </div>
      </div>
    </section>
  );
}

function DesktopBoardPeek() {
  const { go } = useApp();
  return (
    <section className="railcard">
      <div className="railcard-head">
        <h3 className="railcard-title display">Self-paced board</h3>
        <button className="railcard-link" onClick={() => go("progress")}>Full board <Icon name="chevron" size={13} stroke={2.2} /></button>
      </div>
      <div className="board flat">
        {LEADERBOARD.slice(0, 4).map((e) => (
          <div key={e.rank} className={"boardrow" + (e.you ? " you" : "")}>
            <span className={"board-rank r" + e.rank}>{e.rank <= 3 ? <Icon name="medal" size={15} stroke={1.8} /> : e.rank}</span>
            <span className="board-name">{e.name}{e.you && <em> · you</em>}</span>
            <span className="board-pts">{e.pts.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopHome() {
  const { openActivity, go } = useApp();
  return (
    <div className="dhome">
      <div className="dhome-main">
        {/* Wide continue hero */}
        <button className="dhero" style={{ "--cat": `var(--cat-${NEXT_UP.cat})` }} onClick={() => openActivity(NEXT_UP)}>
          <div className="hero-glow" aria-hidden="true"></div>
          <CatBadge tone={NEXT_UP.cat} size={68} />
          <div className="dhero-body">
            <span className="hero-kicker"><Icon name="bolt" size={13} fill stroke={0} /> Pick up where you left off</span>
            <div className="dhero-title display">{NEXT_UP.title}</div>
            <div className="dhero-meta">Stage {NEXT_UP.stage} · Building Up · {NEXT_UP.mins} min · <b>+15 XP</b></div>
            <div className="dhero-foot"><Bar value={NEXT_UP.progress} tone={NEXT_UP.cat} /><span className="hero-pct">{NEXT_UP.progress}%</span></div>
          </div>
          <span className="dhero-play"><span className="hero-play-ping" /><Icon name="play" size={26} fill stroke={0} /></span>
        </button>

        <div className="dhome-row">
          <DailyGoalCard />
          <button className="habit" onClick={() => openActivity({ ...DAILY_VOCAB, cat: "vocab", title: DAILY_VOCAB.title, mins: 4, type: "vocab" })}>
            <span className="habit-ico" style={{ "--cat": "var(--cat-vocab)" }}><Icon name="cards" size={22} stroke={2} /></span>
            <div className="habit-txt">
              <div className="habit-title">Daily Vocab Review</div>
              <div className="habit-sub">{DAILY_VOCAB.words} words · keeps your streak</div>
            </div>
            <span className="habit-streak"><Icon name="flame" size={14} fill stroke={0} /> Keep {LEARNER.streak}</span>
          </button>
        </div>

        <section className="dblock">
          <SectionHead title="Explore" action="See all" onAction={() => go("browse")} />
          <div className="dcatgrid">
            {CATEGORIES.map((c) => (
              <button key={c.id} className="catcard" style={{ "--cat": `var(--cat-${c.tone})` }} onClick={() => go("browse", { category: c.id })}>
                <span className="catcard-ico"><Icon name={c.icon} size={26} stroke={2} /></span>
                <span className="catcard-name">{c.label}</span>
                <span className="catcard-count">{c.count} activities</span>
              </button>
            ))}
          </div>
        </section>

        <button className="winddown" onClick={() => go("browse", { category: "games" })}>
          <div className="winddown-art" aria-hidden="true"><Icon name="moon" size={20} /><Icon name="gamepad" size={26} stroke={2} /></div>
          <div className="winddown-txt">
            <div className="winddown-title display">Wind down with a game</div>
            <div className="winddown-sub">Short, fun & low-pressure — perfect before bed</div>
          </div>
          <Icon name="chevron" size={18} />
        </button>
      </div>

      <aside className="dhome-rail">
        <MomentumCard />
        <DesktopTrackMini />
        <DesktopAwardPeek />
        <DesktopBoardPeek />
      </aside>
    </div>
  );
}

function DesktopApp() {
  const { screen } = useApp();
  return (
    <div className="desk">
      <DesktopSidebar />
      <main className="desk-content">
        {screen !== "activity" && <DesktopTopbar />}
        {screen === "home" && <DesktopHome />}
        {screen === "track" && <div className="desk-screen"><TrackScreen /></div>}
        {screen === "browse" && <div className="desk-screen"><BrowseScreen /></div>}
        {screen === "progress" && <div className="desk-screen"><ProgressScreen /></div>}
        {screen === "activity" && <div className="desk-screen narrow"><ActivityScreen /></div>}
      </main>
    </div>
  );
}

Object.assign(window, { DesktopApp });
