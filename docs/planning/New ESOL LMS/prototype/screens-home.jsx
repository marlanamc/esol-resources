// =========================================================
// Screens: Home (next-up) + Track (self-directed roadmap)
// =========================================================

function Greeting() {
  return (
    <header className="greet">
      <div>
        <div className="greet-hi">Good evening</div>
        <h1 className="greet-name display">{LEARNER.name}</h1>
      </div>
      <button className="iconbtn" aria-label="Notifications">
        <Icon name="bell" size={20} /><span className="bell-dot" />
      </button>
    </header>
  );
}

// Momentum: streak flame + 7-day week + XP/level bar
function MomentumCard() {
  const xpPct = Math.round((LEARNER.xp / LEARNER.xpForLevel) * 100);
  return (
    <div className="momentum">
      <div className="momentum-glow" aria-hidden="true"></div>
      <div className="momentum-top">
        <span className="flame-big"><Icon name="flame" size={30} fill stroke={0} /></span>
        <div className="momentum-streak">
          <div className="momentum-num display">{LEARNER.streak}<span> day streak</span></div>
          <div className="momentum-msg">You're on fire — keep it going!</div>
        </div>
        <span className="momentum-best" title="Longest streak"><Icon name="trophy" size={12} /> {LEARNER.longestStreak}</span>
      </div>
      <div className="weekrow">
        {LEARNER.week.map((d, i) => {
          const today = i === LEARNER.week.length - 1;
          return (
            <div key={i} className={"weekday" + (d ? " done" : "") + (today ? " today" : "")}>
              <span className="weekday-dot">{d ? <Icon name="check" size={12} stroke={3} /> : today ? <Icon name="flame" size={11} fill stroke={0} /> : null}</span>
              <span className="weekday-lbl">{LEARNER.todayLabel[i]}</span>
            </div>
          );
        })}
      </div>
      <div className="xprow">
        <span className="lvbadge">LV {LEARNER.level}</span>
        <div className="xpbar">
          <div className="xpbar-fill" style={{ width: xpPct + "%" }}><span className="xpbar-shine" /></div>
        </div>
        <span className="xpleft">{LEARNER.xp}<i>/{LEARNER.xpForLevel} XP</i></span>
      </div>
    </div>
  );
}

// Today's goal loop with a bonus reward
function DailyGoalCard() {
  const { go } = useApp();
  const pct = (LEARNER.dailyDone / LEARNER.dailyGoal) * 100;
  const left = LEARNER.dailyGoal - LEARNER.dailyDone;
  return (
    <button className="dailygoal" onClick={() => go("track")}>
      <ProgressRing value={pct} size={56} stroke={7} color="var(--accent)">
        <span className="ring-pct display">{LEARNER.dailyDone}/{LEARNER.dailyGoal}</span>
      </ProgressRing>
      <div className="dailygoal-txt">
        <div className="dailygoal-title display">Today's goal</div>
        <div className="dailygoal-sub">{left} more {left === 1 ? "activity" : "activities"} to claim your bonus</div>
      </div>
      <span className="dailygoal-reward"><Icon name="bolt" size={12} fill stroke={0} /> +{LEARNER.dailyReward}</span>
    </button>
  );
}

function HomeScreen() {
  const { go, openActivity, fireReward } = useApp();
  return (
    <div className="screen home-screen">
      <Greeting />
      <MomentumCard />
      <DailyGoalCard />

      {/* Continue hero */}
      <button className="hero" style={{ "--cat": `var(--cat-${NEXT_UP.cat})` }} onClick={() => openActivity(NEXT_UP)}>
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="hero-top">
          <span className="hero-kicker"><Icon name="bolt" size={13} fill stroke={0} /> Pick up where you left off</span>
          <span className="hero-xp">+15 XP</span>
        </div>
        <div className="hero-main">
          <CatBadge tone={NEXT_UP.cat} size={56} />
          <div className="hero-text">
            <div className="hero-stage">Stage {NEXT_UP.stage} · Building Up · {NEXT_UP.mins} min</div>
            <div className="hero-title display">{NEXT_UP.title}</div>
          </div>
        </div>
        <div className="hero-foot">
          <Bar value={NEXT_UP.progress} tone={NEXT_UP.cat} />
          <span className="hero-pct">{NEXT_UP.progress}%</span>
          <span className="hero-play"><span className="hero-play-ping" /><Icon name="play" size={20} fill stroke={0} /></span>
        </div>
      </button>

      {/* Daily habit */}
      <button className="habit" onClick={() => openActivity({ ...DAILY_VOCAB, cat: "vocab", title: DAILY_VOCAB.title, mins: 4, type: "vocab" })}>
        <span className="habit-ico" style={{ "--cat": "var(--cat-vocab)" }}><Icon name="cards" size={22} stroke={2} /></span>
        <div className="habit-txt">
          <div className="habit-title">Daily Vocab Review</div>
          <div className="habit-sub">{DAILY_VOCAB.words} words · keeps your streak alive</div>
        </div>
        <span className="habit-streak"><Icon name="flame" size={14} fill stroke={0} /> Keep {LEARNER.streak}</span>
      </button>

      {/* Your track */}
      <section className="block">
        <SectionHead title="Your track" action="Full map" onAction={() => go("track")} />
        <button className="trackmini" onClick={() => go("track")}>
          <ProgressRing value={42} size={62} stroke={7} color="var(--cat-grammar)">
            <span className="ring-pct display">42%</span>
          </ProgressRing>
          <div className="trackmini-txt">
            <div className="trackmini-stage display">Stage 2 · Building Up</div>
            <div className="trackmini-sub">8 of 19 activities done</div>
            <div className="trackmini-dots">
              {[1,1,1,1,0,0].map((d,i) => <span key={i} className={"tdot" + (d ? " on" : "")} />)}
            </div>
          </div>
          <Icon name="chevron" size={18} className="trackmini-arr" />
        </button>
      </section>

      {/* Explore categories */}
      <section className="block">
        <SectionHead title="Explore" action="See all" onAction={() => go("browse")} />
        <div className="catrow">
          {CATEGORIES.map((c) => (
            <button key={c.id} className="cattile" style={{ "--cat": `var(--cat-${c.tone})` }} onClick={() => go("browse", { category: c.id })}>
              <span className="cattile-ico"><Icon name={c.icon} size={26} stroke={2} /></span>
              <span className="cattile-lbl">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Almost there achievement */}
      <section className="block">
        <SectionHead title="Almost there" action="All awards" onAction={() => go("progress")} />
        <div className="nearaward shimmer" style={{ "--cat": "var(--cat-games)" }}
          onClick={() => fireReward({ name: "Night Owl", desc: "Study 5 evenings in a row", icon: "moon", tone: "games", kicker: "Preview reward" })}>
          <span className="nearaward-ico"><Icon name="moon" size={24} stroke={2} /></span>
          <div className="nearaward-txt">
            <div className="nearaward-name">Night Owl</div>
            <div className="nearaward-sub">4 of 5 evenings · one more to unlock</div>
            <Bar value={80} tone="games" />
          </div>
        </div>
      </section>

      {/* Wind down CTA */}
      <button className="winddown" onClick={() => go("browse", { category: "games" })}>
        <div className="winddown-art" aria-hidden="true">
          <Icon name="moon" size={20} /><Icon name="gamepad" size={26} stroke={2} />
        </div>
        <div className="winddown-txt">
          <div className="winddown-title display">Wind down with a game</div>
          <div className="winddown-sub">Short, fun & low-pressure — perfect before bed</div>
        </div>
        <Icon name="chevron" size={18} />
      </button>

      <div className="screen-pad" />
    </div>
  );
}

// ---------------- Track / roadmap ----------------
function TrackScreen() {
  const { openActivity } = useApp();
  const totalItems = STAGES.reduce((a, s) => a + s.items.length, 0);
  const doneItems = STAGES.reduce((a, s) => a + s.items.filter(i => i.done).length, 0);
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="screen">
      <header className="pagehead">
        <div>
          <div className="pagehead-kicker">Self-directed</div>
          <h1 className="pagehead-title display">Your Journey</h1>
        </div>
      </header>

      <div className="journeyhead">
        <ProgressRing value={pct} size={76} stroke={8} color="var(--primary)">
          <span className="ring-pct display">{pct}%</span>
        </ProgressRing>
        <div className="journeyhead-txt">
          <div className="journeyhead-big display">{doneItems} of {totalItems} done</div>
          <div className="journeyhead-sub">Go at your own pace — nothing is locked. Tap any activity to start.</div>
        </div>
      </div>

      <div className="roadmap">
        {STAGES.map((stage, si) => {
          const sDone = stage.items.filter(i => i.done).length;
          const complete = sDone === stage.items.length;
          const current = stage.items.some(i => i.current) || (!complete && stage.items.some(i => i.done));
          return (
            <section key={stage.n} className={"stage" + (complete ? " is-complete" : current ? " is-current" : "")}>
              <div className="stage-spine" aria-hidden="true">
                <span className="stage-node">
                  {complete ? <Icon name="check" size={16} stroke={2.4} /> : <b>{stage.n}</b>}
                </span>
                {si < STAGES.length - 1 && <span className="stage-line" />}
              </div>
              <div className="stage-body">
                <div className="stage-head">
                  <div>
                    <h3 className="stage-title display">{stage.title}</h3>
                    <div className="stage-caption">{stage.caption}</div>
                  </div>
                  {complete
                    ? <span className="stage-chip ok"><Icon name="check" size={12} stroke={2.6} /> Done</span>
                    : current
                    ? <span className="stage-chip now">In progress</span>
                    : <span className="stage-chip">{sDone}/{stage.items.length}</span>}
                </div>
                <div className="stage-items">
                  {stage.items.map((it) => (
                    <button key={it.id} className={"trackitem" + (it.current ? " is-next" : "")} style={{ "--cat": `var(--cat-${it.cat})` }} onClick={() => openActivity(it)}>
                      <span className={"trackitem-mark" + (it.done ? " done" : "")}>
                        {it.done ? <Icon name="check" size={14} stroke={2.6} /> : <Icon name={TYPE_ICON[it.type] || "play"} size={14} stroke={2} />}
                      </span>
                      <span className="trackitem-txt">
                        <span className="trackitem-title">{it.title}</span>
                        <span className="trackitem-meta">{it.type} · {it.mins} min</span>
                      </span>
                      {it.current
                        ? <span className="trackitem-next">Next</span>
                        : <Icon name="chevron" size={15} className="trackitem-arr" />}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div className="screen-pad" />
    </div>
  );
}

Object.assign(window, { HomeScreen, TrackScreen });
