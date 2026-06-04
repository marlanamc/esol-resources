// =========================================================
// Icon set — simple, consistent line icons (currentColor)
// =========================================================
const ICON_PATHS = {
  home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M9.5 20v-5.5h5V20"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></>,
  browse: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/></>,
  trophy: <><path d="M7 4h10v3a5 5 0 0 1-10 0z"/><path d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10"/><path d="M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10"/><path d="M9.5 13.5h5l-.5 3.5h-4z"/><path d="M8 20h8"/></>,
  user: <><circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  flame: <><path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-.7-.2-1.3-.5-1.8 2 1 3.5 3 3.5 5.6a5 5 0 0 1-10 0C7 9.5 10 7 12 3z"/></>,
  check: <><path d="M5 12.5 10 17 19 7"/></>,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></>,
  play: <><path d="M8 5.5v13l11-6.5z"/></>,
  star: <><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/></>,
  medal: <><circle cx="12" cy="14" r="5.5"/><path d="M9 9 7 3h4l1.5 4M15 9l2-6h-4l-1.5 4"/><path d="m12 12 .9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2L9.1 14l2-.3z"/></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M8.5 21h7"/></>,
  gamepad: <><rect x="2.5" y="7.5" width="19" height="9" rx="4.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.5" r=".9"/><circle cx="17.8" cy="13.5" r=".9"/></>,
  chat: <><path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/><path d="M8 9h8M8 12h5"/></>,
  target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3"/></>,
  blocks: <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="8.2" y="13" width="7.5" height="7.5" rx="1.6"/></>,
  cards: <><rect x="3.5" y="6.5" width="11" height="14" rx="2"/><path d="M8 6.5 9.5 4l9.5 2.6-3 11.4"/><path d="M6.5 11h5M6.5 14h5"/></>,
  train: <><rect x="6" y="3.5" width="12" height="13" rx="3"/><path d="M6 10h12"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="m8 17-2 3.5M16 17l2 3.5"/></>,
  moon: <><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></>,
  boot: <><path d="M8 3h3v8c0 2 1 3 3 3.5l3 1c1.5.6 2 1.5 2 3.5H6c-1 0-2-.8-2-2 0-1.5 1-2.5 2.5-3 1-.4 1.5-1 1.5-2.5z"/></>,
  pencil: <><path d="M14.5 5.5 18.5 9.5 8 20H4v-4z"/><path d="M13 7 17 11"/></>,
  sparkles: <><path d="M12 4l1.6 3.9L17.5 9.5 13.6 11 12 15l-1.6-4L6.5 9.5l3.9-1.6z"/><path d="M18 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></>,
  chevron: <><path d="m9 5 7 7-7 7"/></>,
  chevronLeft: <><path d="m15 5-7 7 7 7"/></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
  settings: <><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.5M12 19v2.5M4.2 7l2.2 1.3M17.6 15.7l2.2 1.3M4.2 17l2.2-1.3M17.6 8.3l2.2-1.3"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8"/></>,
  x: <><path d="M6 6l12 12M18 6 6 18"/></>,
  volume: <><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></>,
  refresh: <><path d="M4 12a8 8 0 0 1 13.5-5.8L20 8M20 8V4M20 8h-4"/><path d="M20 12a8 8 0 0 1-13.5 5.8L4 16M4 16v4M4 16h4"/></>,
  bolt: <><path d="M13 3 5 13h6l-1 8 8-10h-6z"/></>,
  clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
  flag: <><path d="M6 21V4M6 4h11l-2 3.5L17 11H6"/></>,
  book: <><path d="M5 4.5h9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H5z"/><path d="M5 4.5v13"/></>,
  heart: <><path d="M12 20S4 14.5 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5.5-8 11-8 11z"/></>,
};

function Icon({ name, size = 24, stroke = 1.8, fill = false, className = "", style = {} }) {
  const path = ICON_PATHS[name] || ICON_PATHS.star;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true">
      {path}
    </svg>
  );
}

const CAT_ICON = { grammar: "blocks", vocab: "cards", games: "gamepad", pron: "mic", quiz: "target", speak: "chat" };
const TYPE_ICON = { guide: "book", vocab: "cards", game: "gamepad", practice: "pencil", quiz: "target", speak: "chat" };

Object.assign(window, { Icon, ICON_PATHS, CAT_ICON, TYPE_ICON });
