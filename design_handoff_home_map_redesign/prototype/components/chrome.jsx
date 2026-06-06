/* Shared chrome + sidebar widgets */

/* ---------- top app bar ---------- */
function AppBar({ device, page, mode }) {
  const mobile = device === 'mobile';
  const st = mode === 'independent' ? CC_DATA.STATE.independent : CC_DATA.STATE.inClass;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30,
      background: 'color-mix(in srgb, var(--surface) 86%, transparent)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile ? '10px 16px' : '12px 26px',
        maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(150deg, var(--primary-light), var(--primary))',
            display: 'grid', placeItems: 'center', fontSize: 18, boxShadow: 'var(--sh-pop)' }}>📚</div>
          {!mobile && <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Class Companion</div>
          </div>}
        </div>
        {!mobile && (
          <div className="cc-focus" tabIndex={0} style={{ flex: 1, maxWidth: 380, marginLeft: 18, display: 'flex', alignItems: 'center', gap: 9,
            background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '9px 15px',
            color: 'var(--text-light)', fontSize: 13.5, fontWeight: 600, boxShadow: 'var(--sh-sm)' }}>
            <Icon name="search" s={16} /> Search activities, words, guides…
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 12 }}>
          <Pill fg="#b8742a" bg="#fbf0dd" strong style={{ padding: '6px 11px', fontSize: 12.5 }}>
            <span style={{ color: '#d98a2b', display: 'inline-flex' }}><Icon name="flame" s={15} /></span>{st.streak}
          </Pill>
          {!mobile && <Pill fg="var(--secondary-dark)" bg="#e9f0ea" strong style={{ padding: '6px 11px', fontSize: 12.5 }}>
            <span style={{ color: 'var(--secondary)', display: 'inline-flex' }}><Icon name="bolt" s={15} /></span>{st.points.toLocaleString()}
          </Pill>}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(150deg, var(--accent), var(--accent-dark))',
            display: 'grid', placeItems: 'center', fontWeight: 800, color: '#5a4520', fontSize: 14, boxShadow: 'var(--sh-sm)' }}>
            {st.name[0]}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- mobile bottom nav ---------- */
function BottomNav({ active }) {
  const tabs = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'map', label: 'Map', icon: 'map' },
    { key: 'browse', label: 'Activities', icon: 'grid' },
    { key: 'me', label: 'Profile', icon: 'user' },
  ];
  return (
    <nav style={{ position: 'sticky', bottom: 0, zIndex: 30, display: 'flex',
      background: 'color-mix(in srgb, var(--surface) 92%, transparent)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--line)', padding: '8px 6px 10px' }}>
      {tabs.map(t => {
        const on = t.key === active;
        return (
          <div key={t.key} style={{ flex: 1, display: 'grid', justifyItems: 'center', gap: 3,
            color: on ? 'var(--primary)' : 'var(--text-light)' }}>
            <Icon name={t.icon} s={22} />
            <span style={{ fontSize: 10, fontWeight: on ? 800 : 600 }}>{t.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

/* ---------- momentum card (in-class: standard) ---------- */
function MomentumCard({ st, dialed }) {
  return (
    <div className="cc-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Ring pct={Math.min(100, st.streak/14*100)} size={64} stroke={6} color="#e0922e" track="var(--bg-deep)">
          <div style={{ display: 'grid', placeItems: 'center', lineHeight: 1 }}>
            <span style={{ color: '#e0922e', display: 'inline-flex' }}><Icon name="flame" s={20} /></span>
            <span style={{ fontWeight: 800, fontSize: 16, marginTop: 1 }}>{st.streak}</span>
          </div>
        </Ring>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{st.streak}-day streak</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Longest: {st.longestStreak} days · keep it going!</div>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--line-soft)', margin: '15px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <WeekDots data={st.weekActivity} accent="#e0922e" />
        <Pill fg="var(--secondary-dark)" bg="#e9f0ea" strong style={{ fontSize: 12 }}>
          <span style={{ color: 'var(--secondary)', display: 'inline-flex' }}><Icon name="bolt" s={14} /></span>{st.points.toLocaleString()} pts
        </Pill>
      </div>
    </div>
  );
}

/* ---------- dialed-up momentum (independent) ---------- */
function LevelMomentumCard({ st }) {
  const lvlPct = Math.round(st.xpThisLevel / st.xpForLevel * 100);
  return (
    <div className="cc-card" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Ring pct={lvlPct} size={68} stroke={7} color="var(--primary)" track="var(--bg-deep)">
            <div style={{ display: 'grid', placeItems: 'center', lineHeight: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-light)', letterSpacing: '.06em' }}>LVL</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>{st.currentLevel}</span>
            </div>
          </Ring>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{st.xpThisLevel} / {st.xpForLevel} XP</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{st.xpForLevel - st.xpThisLevel} XP to Level {st.currentLevel + 1}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          <div style={{ background: '#fbf0dd', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d98a2b' }}>
              <Icon name="flame" s={16} /><span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>{st.streak}</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>day streak</div>
          </div>
          <div style={{ background: '#e9f0ea', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--secondary)' }}>
              <Icon name="bolt" s={16} /><span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>{st.points.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>total points</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}><WeekDots data={st.weekActivity} accent="var(--primary)" /></div>
      </div>
    </div>
  );
}

/* ---------- mini calendar (in-class only) ---------- */
function MiniCalendar() {
  const today = 15;
  const events = { 16: 'quiz', 20: 'class', 24: 'holiday' };
  const eColor = { quiz: 'var(--primary)', class: 'var(--secondary)', holiday: '#6d89ac' };
  const offset = 3; // Jan 1 2026 = Thursday (Mon-start)
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>January 2026</div>
        <div style={{ display: 'flex', gap: 4, color: 'var(--text-light)' }}>
          <span style={{ transform: 'rotate(180deg)' }}><Icon name="chevR" s={15} /></span><Icon name="chevR" s={15} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-light)', padding: '2px 0' }}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday = d === today;
          const ev = events[d];
          return (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', display: 'grid', placeItems: 'center',
              borderRadius: 9, fontSize: 11.5, fontWeight: isToday ? 800 : 600,
              background: isToday ? 'var(--primary)' : 'transparent', color: isToday ? '#fff' : 'var(--text)' }}>
              {d}
              {ev && !isToday && <span style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: eColor[ev] }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingList() {
  const items = [
    { d: 'Thu 16', t: 'Verb Quiz 14 due', c: 'var(--primary)', tag: 'Due' },
    { d: 'Mon 20', t: 'In-class field trip', c: 'var(--secondary)', tag: 'Class' },
    { d: 'Fri 24', t: 'No class — holiday', c: '#6d89ac', tag: 'Holiday' },
  ];
  return (
    <div style={{ display: 'grid', gap: 9 }}>
      {items.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: e.c }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>{e.t}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{e.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- weekly goal (independent) ---------- */
function WeeklyGoalCard({ st }) {
  const pct = Math.round(st.weeklyDone / st.weeklyGoal * 100);
  return (
    <div className="cc-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--secondary)' }}><Icon name="target" s={18} /></span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Weekly goal</span>
        </div>
        <Pill fg="var(--text-muted)" bg="var(--surface-2)">{st.daysLeft} days left</Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--secondary-dark)' }}>{st.weeklyDone}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>of {st.weeklyGoal} activities</span>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: st.weeklyGoal }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 5, background: i < st.weeklyDone ? 'var(--secondary)' : 'var(--bg-deep)' }} />
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 10 }}>One more to hit your goal 🎯</div>
    </div>
  );
}

/* ---------- leaderboard chip (independent, dialed up) ---------- */
function LeaderboardCard({ st }) {
  return (
    <div className="cc-card" style={{ padding: 16, background: 'linear-gradient(150deg, #fbf5e6, var(--surface))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fbf0dd', display: 'grid', placeItems: 'center', color: '#c79a2b' }}>
          <Icon name="trophy" s={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>You're <span style={{ color: '#b8742a' }}>#{st.rank}</span> this week</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>Self-paced leaderboard · 38 learners</div>
        </div>
        <Icon name="chevR" s={18} style={{ color: 'var(--text-light)' }} />
      </div>
    </div>
  );
}

/* ---------- explore categories ---------- */
function CategoryGrid({ device }) {
  const cols = device === 'mobile' ? 3 : 6;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
      {CC_DATA.CATEGORIES.map(c => {
        const t = tone(c.tone);
        return (
          <div key={c.key} className="cc-focus" tabIndex={0} style={{ display: 'grid', justifyItems: 'center', gap: 8,
            padding: '14px 6px', borderRadius: 18, background: t.bg, cursor: 'pointer',
            border: `1px solid color-mix(in srgb, ${t.fg} 16%, transparent)`, transition: 'transform .15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 19,
              background: `color-mix(in srgb, ${t.fg} 12%, var(--surface))`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.fg} 22%, transparent)` }}>{c.glyph}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: t.fg, textAlign: 'center', lineHeight: 1.1 }}>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- spotlight strip (the de-emphasized "featured") ---------- */
function SpotlightStrip({ variant, device }) {
  // variant: 'inclass' (focus on) | 'independent' (new this week)
  const data = variant === 'independent' ? {
    overline: 'New this week', note: 'Optional · just added',
    cards: [
      { title: 'Idioms at Work', type: 'game', tag: 'New game', mins: 11 },
      { title: 'Small Talk Booster', type: 'speaking', tag: 'New', mins: 9 },
      { title: 'Tricky Plurals', type: 'vocab', tag: 'New', mins: 7 },
    ],
  } : {
    overline: 'From your teacher', note: 'Worth a look this week',
    cards: [
      { title: 'Review: Past Tense Mix', type: 'quiz', tag: 'Focus on this', mins: 10 },
      { title: 'Extra: Listening Café', type: 'speaking', tag: 'Optional', mins: 12 },
      { title: 'Word of the Day', type: 'vocab', tag: 'Daily', mins: 4 },
    ],
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
        <div>
          <Overline color={variant==='independent' ? 'var(--t-game)' : 'var(--primary)'}>{data.overline}</Overline>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>{data.note}</div>
        </div>
      </div>
      <div className="cc-scroll" style={device === 'mobile'
        ? { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, scrollSnapType: 'x mandatory' }
        : { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {data.cards.map((c, i) => {
          const meta = CC_DATA.TYPES[c.type]; const t = tone(meta.tone);
          return (
            <div key={i} className="cc-focus" tabIndex={0} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 13,
              borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--sh-sm)', cursor: 'pointer',
              ...(device === 'mobile' ? { flex: '0 0 248px', scrollSnapAlign: 'start' } : { minWidth: 0 }) }}>
              <TypeGlyph type={c.type} size={42} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <Pill fg={t.fg} bg={t.bg} style={{ fontSize: 10, marginBottom: 5 }}>{c.tag}</Pill>
                <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3, fontWeight: 600 }}>{meta.label} · {c.mins} min</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { AppBar, BottomNav, MomentumCard, LevelMomentumCard, MiniCalendar, UpcomingList, WeeklyGoalCard, LeaderboardCard, CategoryGrid, SpotlightStrip });
