// =========================================================
// Screens: Browse · Activity (interactive) · Progress/You
// =========================================================

const { useState, useEffect } = React;
const ALL_ITEMS = STAGES.flatMap((s) => s.items.map((i) => ({ ...i, stage: s.n })));

function BrowseScreen() {
  const { browseCat, setBrowseCat, openActivity, go } = useApp();
  const cat = CATEGORIES.find((c) => c.id === browseCat);

  if (cat) {
    const items = ALL_ITEMS.filter((i) => i.cat === cat.id);
    const list = items.length ? items : ALL_ITEMS.slice(0, 4).map((i) => ({ ...i, cat: cat.id }));
    return (
      <div className="screen">
        <header className="pagehead with-back">
          <button className="backbtn" onClick={() => setBrowseCat(null)} aria-label="Back"><Icon name="chevronLeft" size={20} stroke={2.2} /></button>
          <div className="pagehead-catrow">
            <CatBadge tone={cat.tone} size={40} icon={cat.icon} />
            <div>
              <h1 className="pagehead-title display">{cat.label}</h1>
              <div className="pagehead-kicker">{cat.count} activities · {cat.blurb}</div>
            </div>
          </div>
        </header>
        <div className="list">
          {list.map((it) => (
            <button key={it.id} className="listitem" style={{ "--cat": `var(--cat-${it.cat})` }} onClick={() => openActivity(it)}>
              <span className="listitem-ico"><Icon name={TYPE_ICON[it.type] || "book"} size={20} stroke={2} /></span>
              <span className="listitem-txt">
                <span className="listitem-title">{it.title}</span>
                <span className="listitem-meta">{it.type} · {it.mins} min{it.done ? " · completed" : ""}</span>
              </span>
              {it.done ? <span className="listitem-done"><Icon name="check" size={14} stroke={2.6} /></span> : <Icon name="play" size={16} fill stroke={0} className="listitem-play" />}
            </button>
          ))}
        </div>
        <div className="screen-pad" />
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="pagehead">
        <div>
          <div className="pagehead-kicker">Everything, browsable</div>
          <h1 className="pagehead-title display">Browse</h1>
        </div>
      </header>
      <button className="searchpill" onClick={() => {}}>
        <Icon name="search" size={18} /><span>Search activities & words…</span>
      </button>

      <button className="pathcard" onClick={() => go("track")}>
        <div className="pathcard-art" aria-hidden="true"><Icon name="compass" size={26} stroke={1.9} /></div>
        <div className="pathcard-txt">
          <div className="pathcard-title display">Follow the recommended path</div>
          <div className="pathcard-sub">Not sure what's next? We'll guide you step by step.</div>
        </div>
        <Icon name="chevron" size={18} />
      </button>

      <div className="catgrid">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="catcard" style={{ "--cat": `var(--cat-${c.tone})` }} onClick={() => setBrowseCat(c.id)}>
            <span className="catcard-ico"><Icon name={c.icon} size={26} stroke={2} /></span>
            <span className="catcard-name">{c.label}</span>
            <span className="catcard-count">{c.count} activities</span>
          </button>
        ))}
      </div>
      <div className="screen-pad" />
    </div>
  );
}

// ---------------- Activity (interactive) ----------------
function ActivityScreen() {
  const { activeItem, closeActivity, fireReward } = useApp();
  const item = activeItem || { title: "Activity", cat: "vocab", mins: 5 };
  const demo = ACTIVITY_DEMO;
  const [step, setStep] = useState(0); // 0..cards-1 = flashcards, cards = check, cards+1 = done
  const [flipped, setFlipped] = useState(false);
  const [choice, setChoice] = useState(null);
  const nCards = demo.cards.length;
  const total = nCards + 2;
  const checkStep = nCards;
  const doneStep = nCards + 1;

  const next = () => { setFlipped(false); setStep((s) => Math.min(doneStep, s + 1)); };
  const pick = (i) => {
    if (choice !== null) return;
    setChoice(i);
    setTimeout(() => {
      setStep(doneStep);
      fireReward({ name: "+30 points", desc: "Activity complete · streak safe", icon: "bolt", tone: item.cat, kicker: "Nice work" });
    }, 1100);
  };

  return (
    <div className="screen activity-screen" style={{ "--cat": `var(--cat-${item.cat})` }}>
      <header className="act-head">
        <button className="backbtn ghost" onClick={closeActivity} aria-label="Close"><Icon name="x" size={20} stroke={2.2} /></button>
        <div className="act-progress">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={"act-seg" + (i <= step ? " on" : "")} />
          ))}
        </div>
        <button className="iconbtn ghost" aria-label="Listen"><Icon name="volume" size={20} /></button>
      </header>

      <div className="act-title-row">
        <CatBadge tone={item.cat} size={34} />
        <span className="act-title">{item.title}</span>
      </div>

      {/* Flashcards */}
      {step < nCards && (() => {
        const card = demo.cards[step];
        return (
          <div className="act-body">
            <div className="act-stepnote">Tap the card to see the meaning</div>
            <button className={"flashcard" + (flipped ? " flipped" : "")} onClick={() => setFlipped((f) => !f)}>
              <div className="flash-inner">
                <div className="flash-face flash-front">
                  <div className="flash-img" aria-hidden="true"><Icon name="cards" size={34} stroke={1.6} /></div>
                  <div className="flash-word display">{card.word}</div>
                  <div className="flash-tap"><Icon name="refresh" size={14} /> tap to flip</div>
                </div>
                <div className="flash-face flash-back">
                  <div className="flash-hint">{card.hint}</div>
                  <div className="flash-ex">“{card.example}”</div>
                  <button className="flash-listen" onClick={(e) => e.stopPropagation()}><Icon name="volume" size={16} /> Listen</button>
                </div>
              </div>
            </button>
            <button className="bigbtn" onClick={next}>
              {step < nCards - 1 ? "Next word" : "Got it — quiz me"}<Icon name="arrow" size={18} stroke={2.2} />
            </button>
          </div>
        );
      })()}

      {/* Check question */}
      {step === checkStep && (
        <div className="act-body">
          <div className="act-stepnote">Quick check</div>
          <div className="check-q display">{demo.check.q}</div>
          <div className="check-opts">
            {demo.check.options.map((opt, i) => {
              const isAns = i === demo.check.answer;
              const state = choice === null ? "" : isAns ? " correct" : choice === i ? " wrong" : " dim";
              return (
                <button key={i} className={"check-opt" + state} onClick={() => pick(i)}>
                  <span className="check-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="check-label">{opt}</span>
                  {choice !== null && isAns && <Icon name="check" size={18} stroke={2.6} />}
                  {choice === i && !isAns && <Icon name="x" size={18} stroke={2.6} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Done */}
      {step === doneStep && (
        <div className="act-body act-done">
          <div className="done-burst"><Icon name="check" size={40} stroke={2.4} /></div>
          <div className="done-title display">Activity complete!</div>
          <div className="done-sub">You earned <b>+30 points</b> and kept your <b>{LEARNER.streak}-day streak</b>.</div>
          <div className="done-stats">
            <div className="done-stat"><Icon name="cards" size={18} stroke={2} /><b>3</b><span>words</span></div>
            <div className="done-stat"><Icon name="bolt" size={18} fill stroke={0} /><b>+30</b><span>points</span></div>
            <div className="done-stat"><Icon name="flame" size={18} fill stroke={0} /><b>{LEARNER.streak}</b><span>streak</span></div>
          </div>
          <button className="bigbtn" onClick={closeActivity}>Keep going<Icon name="arrow" size={18} stroke={2.2} /></button>
          <button className="textbtn" onClick={closeActivity}>Back to home</button>
        </div>
      )}
    </div>
  );
}

// ---------------- Progress / You ----------------
function ProgressScreen() {
  const { fireReward } = useApp();
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  return (
    <div className="screen">
      <header className="profilehead">
        <div className="avatar display">{LEARNER.initial}</div>
        <div className="profilehead-txt">
          <h1 className="profilehead-name display">{LEARNER.name}</h1>
          <div className="profilehead-tags">
            <span className="proftag"><Icon name="compass" size={12} stroke={2} /> Independent learner</span>
            <span className="proftag alt">Level {LEARNER.level}</span>
          </div>
        </div>
      </header>

      <div className="statgrid">
        <div className="statbox"><span className="statbox-ico flame"><Icon name="flame" size={18} fill stroke={0} /></span><b>{LEARNER.streak}</b><span>day streak</span></div>
        <div className="statbox"><span className="statbox-ico bolt"><Icon name="bolt" size={18} fill stroke={0} /></span><b>{LEARNER.points.toLocaleString()}</b><span>points</span></div>
        <div className="statbox"><span className="statbox-ico words"><Icon name="cards" size={18} stroke={2} /></span><b>{LEARNER.wordsLearned}</b><span>words</span></div>
      </div>

      {/* Weekly goal */}
      <section className="goalcard">
        <ProgressRing value={(LEARNER.weeklyDone / LEARNER.weeklyGoal) * 100} size={66} stroke={8} color="var(--accent)">
          <span className="ring-pct display">{LEARNER.weeklyDone}/{LEARNER.weeklyGoal}</span>
        </ProgressRing>
        <div className="goalcard-txt">
          <div className="goalcard-title display">Weekly goal</div>
          <div className="goalcard-sub">{LEARNER.weeklyGoal - LEARNER.weeklyDone} more this week. You set the pace — change it anytime.</div>
        </div>
      </section>

      {/* Achievements */}
      <section className="block">
        <SectionHead title="Awards" action={`${earned.length}/${ACHIEVEMENTS.length}`} />
        <div className="awardgrid">
          {ACHIEVEMENTS.map((a) => (
            <button key={a.id} className={"award" + (a.earned ? " earned" : " locked")} style={{ "--cat": `var(--cat-${a.tone})` }}
              onClick={() => fireReward({ name: a.name, desc: a.desc, icon: a.icon, tone: a.tone, kicker: a.earned ? "Earned" : "Keep going" })}>
              <span className="award-ico"><Icon name={a.icon} size={24} stroke={2} /></span>
              <span className="award-name">{a.name}</span>
              {a.earned
                ? <span className="award-badge"><Icon name="check" size={11} stroke={3} /></span>
                : <span className="award-prog">{a.progress ?? 0}%</span>}
              {a.reflects && <span className="award-reflect">{a.reflects}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section className="block">
        <SectionHead title="Certificates" />
        <div className="certrow">
          {CERTIFICATES.map((c) => (
            <div key={c.id} className={"cert" + (c.earned ? " earned" : "")}>
              <div className="cert-medal"><Icon name="medal" size={26} stroke={1.8} /></div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-cap">{c.caption}</div>
              {!c.earned && <div className="cert-prog"><Bar value={c.progress} tone="primary" /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard peek */}
      <section className="block">
        <SectionHead title="Self-paced leaderboard" action="Full board" />
        <div className="board">
          {LEADERBOARD.map((e) => (
            <div key={e.rank} className={"boardrow" + (e.you ? " you" : "")}>
              <span className={"board-rank r" + e.rank}>{e.rank <= 3 ? <Icon name="medal" size={16} stroke={1.8} /> : e.rank}</span>
              <span className="board-name">{e.name}{e.you && <em> · you</em>}</span>
              <span className="board-pts">{e.pts.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="screen-pad" />
    </div>
  );
}

Object.assign(window, { BrowseScreen, ActivityScreen, ProgressScreen });
