/* Journey renderer — three switchable path styles for the "what to do next" experience.
   styleVariant: 'trail' | 'timeline' | 'stones'
   items: [{ title, type, mins, status: 'done'|'current'|'todo'|'locked' }]
   accent: { fg, bg }  */

function statusColors(status, accent) {
  switch (status) {
    case 'done':    return { node: accent.fg, ring: accent.fg, ink: '#fff', label: 'var(--text)' };
    case 'current': return { node: 'var(--surface)', ring: accent.fg, ink: accent.fg, label: 'var(--text)' };
    case 'locked':  return { node: 'var(--surface-2)', ring: 'var(--line)', ink: 'var(--text-light)', label: 'var(--text-light)' };
    default:        return { node: 'var(--surface)', ring: 'var(--line)', ink: 'var(--text)', label: 'var(--text)' };
  }
}

function NodeFace({ item, accent, size = 52 }) {
  const c = statusColors(item.status, accent);
  const meta = CC_DATA.TYPES[item.type] || CC_DATA.TYPES.guide;
  const pulsing = item.status === 'current';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {pulsing && (
        <span style={{ position: 'absolute', inset: -6, borderRadius: '50%',
          border: `2px solid ${accent.fg}`, opacity: .4, animation: 'cc-pulse 1.8s ease-out infinite' }} />
      )}
      <div style={{ width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: c.node, border: `${item.status==='current'?3:2}px solid ${c.ring}`,
        boxShadow: item.status==='done' ? `0 4px 10px color-mix(in srgb, ${accent.fg} 35%, transparent)` : 'var(--sh-sm)',
        color: c.ink, fontSize: size*0.42 }}>
        {item.status === 'done' ? <Icon name="check" s={size*0.46} />
          : item.status === 'locked' ? <Icon name="lock" s={size*0.4} />
          : <span>{meta.glyph}</span>}
      </div>
    </div>
  );
}

/* ============ TRAIL — winding game-like path ============ */
function TrailPath({ items, accent, device }) {
  const mobile = device === 'mobile';
  const n = items.length;
  const step = mobile ? 96 : 104, padTop = 30, padBot = 24;
  const H = padTop + (n - 1) * step + padBot;
  const amp = mobile ? 15 : 24;
  const xPct = (i) => 50 + amp * Math.sin(i * 1.25);
  const pts = items.map((_, i) => ({ x: xPct(i), y: padTop + i * step }));
  const currentIdx = items.findIndex(it => it.status === 'current');
  const doneThru = currentIdx === -1 ? items.filter(it=>it.status==='done').length : currentIdx;

  const pathD = (arr) => arr.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i-1]; const my = (prev.y + p.y) / 2;
    return `C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', height: H }}>
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" width="100%" height={H}
        style={{ position: 'absolute', inset: 0 }}>
        <path d={pathD(pts)} fill="none" stroke="var(--line)" strokeWidth="3.5"
          vectorEffect="non-scaling-stroke" strokeDasharray="2 9" strokeLinecap="round" />
        {doneThru > 0 && (
          <path d={pathD(pts.slice(0, doneThru + 1))} fill="none" stroke={accent.fg} strokeWidth="3.5"
            vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        )}
      </svg>
      {items.map((item, i) => (
        <div key={i} className="cc-anim" style={{ position: 'absolute', left: `${pts[i].x}%`, top: pts[i].y,
          transform: 'translate(-50%, -50%)', width: mobile ? 132 : 150, textAlign: 'center', animationDelay: `${i*60}ms` }}>
          <div style={{ display: 'grid', placeItems: 'center', gap: 7 }}>
            <NodeFace item={item} accent={accent} />
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
              padding: '5px 9px', boxShadow: 'var(--sh-sm)', maxWidth: mobile ? 132 : 150 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2, color: statusColors(item.status, accent).label,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</div>
              {item.status === 'current' && <div style={{ fontSize: 9.5, fontWeight: 800, color: accent.fg, marginTop: 2, letterSpacing: '.05em' }}>YOU'RE HERE</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ TIMELINE — vertical connected list ============ */
function TimelinePath({ items, accent }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 8 }}>
      {items.map((item, i) => {
        const c = statusColors(item.status, accent);
        const meta = CC_DATA.TYPES[item.type] || CC_DATA.TYPES.guide;
        const last = i === items.length - 1;
        return (
          <div key={i} className="cc-anim" style={{ display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: 14, animationDelay: `${i*55}ms` }}>
            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                background: c.node, border: `${item.status==='current'?3:2}px solid ${c.ring}`, color: c.ink,
                boxShadow: item.status==='done' ? `0 3px 7px color-mix(in srgb, ${accent.fg} 32%, transparent)` : 'none' }}>
                {item.status === 'done' ? <Icon name="check" s={16} />
                  : item.status === 'locked' ? <Icon name="lock" s={13} />
                  : item.status === 'current' ? <span style={{ width: 9, height: 9, borderRadius: '50%', background: accent.fg }} />
                  : <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--line)' }} />}
              </div>
              {!last && <div style={{ width: 2.5, flex: 1, minHeight: 16, marginTop: 2, marginBottom: 2,
                background: item.status === 'done' ? accent.fg : 'var(--line)', borderRadius: 2 }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 14, minWidth: 0 }}>
              <div className="cc-focus" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
                borderRadius: 14, cursor: item.status==='locked'?'default':'pointer',
                background: item.status === 'current' ? accent.bg : 'var(--surface)',
                border: `1px solid ${item.status==='current' ? `color-mix(in srgb, ${accent.fg} 30%, transparent)` : 'var(--line)'}`,
                opacity: item.status === 'locked' ? .6 : 1,
                boxShadow: item.status === 'current' ? 'var(--sh-md)' : 'var(--sh-sm)' }}>
                <TypeGlyph type={item.type} size={36} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: c.label, lineHeight: 1.25 }}>{item.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center', color: 'var(--text-light)', fontSize: 11, fontWeight: 600 }}>
                    <span style={{ color: tone(meta.tone).fg }}>{meta.label}</span>
                    <span>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="clock" s={12} />{item.mins} min</span>
                  </div>
                </div>
                {item.status === 'current'
                  ? <Btn size="sm" kind="primary" style={{ background: accent.fg, border: 'none', boxShadow: 'none' }}><Icon name="play" s={13} />Start</Btn>
                  : item.status === 'locked' ? null
                  : <span style={{ color: 'var(--text-light)' }}><Icon name="chevR" s={18} /></span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ STONES — minimal stepping stones ============ */
function StonesPath({ items, accent, device }) {
  const mobile = device === 'mobile';
  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', flexWrap: mobile ? 'nowrap' : 'wrap',
      gap: mobile ? 0 : 14, alignItems: mobile ? 'stretch' : 'flex-start' }}>
      {items.map((item, i) => {
        const c = statusColors(item.status, accent);
        const meta = CC_DATA.TYPES[item.type] || CC_DATA.TYPES.guide;
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <div className="cc-anim cc-focus" style={{ animationDelay: `${i*50}ms`,
              display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: 'center', gap: mobile ? 12 : 8,
              width: mobile ? 'auto' : 130, padding: mobile ? '9px 4px' : '14px 10px', borderRadius: 18,
              background: item.status === 'current' ? accent.bg : 'transparent',
              border: item.status === 'current' ? `1px solid color-mix(in srgb, ${accent.fg} 28%, transparent)` : '1px solid transparent',
              cursor: item.status==='locked'?'default':'pointer', opacity: item.status==='locked'? .55 : 1 }}>
              <NodeFace item={item} accent={accent} size={mobile ? 44 : 48} />
              <div style={{ textAlign: mobile ? 'left' : 'center', minWidth: 0, flex: mobile ? 1 : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.label, lineHeight: 1.2,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-light)', marginTop: 2 }}>
                  {item.status === 'current' ? <span style={{ color: accent.fg, fontWeight: 800 }}>Next up</span> : `${meta.label} · ${item.mins}m`}
                </div>
              </div>
            </div>
            {!last && (mobile
              ? <div style={{ width: 2, height: 14, marginLeft: 25, background: item.status==='done'?accent.fg:'var(--line)', borderRadius: 2 }} />
              : <div style={{ alignSelf: 'center', marginTop: 18, color: item.status==='done'?accent.fg:'var(--line)' }}><Icon name="chevR" s={16} /></div>)}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Journey({ items, styleVariant = 'trail', accent, device }) {
  if (styleVariant === 'timeline') return <TimelinePath items={items} accent={accent} />;
  if (styleVariant === 'stones') return <StonesPath items={items} accent={accent} device={device} />;
  return <TrailPath items={items} accent={accent} device={device} />;
}

Object.assign(window, { Journey, NodeFace, statusColors });
