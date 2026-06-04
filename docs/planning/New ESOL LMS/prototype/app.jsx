// =========================================================
// App root — state, theme context, routing, phone scaler
// =========================================================
const { useState, useEffect, useRef, useCallback } = React;
function App() {
  const [style, setStyle] = useState(() => localStorage.getItem("esol-style") || "hearth");
  const [mode, setMode] = useState(() => localStorage.getItem("esol-mode") || "light");
  const [device, setDevice] = useState(() => localStorage.getItem("esol-device") || "mobile");
  const [screen, setScreen] = useState("home");
  const [browseCat, setBrowseCat] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [reward, setReward] = useState(null);
  const scrollRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => { localStorage.setItem("esol-style", style); }, [style]);
  useEffect(() => { localStorage.setItem("esol-mode", mode); }, [mode]);
  useEffect(() => { localStorage.setItem("esol-device", device); }, [device]);

  // scroll to top on screen change
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen, browseCat, activeItem]);

  const go = useCallback((s, opts = {}) => {
    if (s === "browse") setBrowseCat(opts.category ?? null);
    setActiveItem(null);
    setScreen(s);
  }, []);

  const openActivity = useCallback((item) => { setActiveItem(item); setScreen("activity"); }, []);
  const closeActivity = useCallback(() => { setActiveItem(null); setScreen("home"); }, []);
  const fireReward = useCallback((data) => { setReward(null); setTimeout(() => setReward(data), 30); }, []);

  // Scale the active frame to fit the viewport
  useEffect(() => {
    const fit = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const w = device === "desktop" ? 1200 : 390;
      const h = device === "desktop" ? 760 : 860;
      const availH = window.innerHeight - stage.getBoundingClientRect().top - 32;
      const availW = stage.clientWidth - 32;
      const scale = Math.max(0.4, Math.min(1, availW / w, availH / h));
      stage.style.setProperty("--frame-scale", scale);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [device]);

  const ctx = {
    style, setStyle, mode, setMode, device, setDevice, screen, go,
    browseCat, setBrowseCat, activeItem, openActivity, closeActivity,
    reward, fireReward,
  };

  const isActivity = screen === "activity";

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app" data-style={style} data-mode={mode} data-device={device}>
        <ControlBar />
        <div className={"devstage devstage-" + device} ref={stageRef}>
          {device === "mobile" ? (
            <div className="frame-scale">
              <PhoneShell scrollRef={scrollRef} nav={!isActivity ? <BottomNav /> : null}>
                {screen === "home" && <HomeScreen />}
                {screen === "track" && <TrackScreen />}
                {screen === "browse" && <BrowseScreen />}
                {screen === "activity" && <ActivityScreen />}
                {screen === "progress" && <ProgressScreen />}
              </PhoneShell>
              <RewardToast data={reward} onClose={() => setReward(null)} />
            </div>
          ) : (
            <div className="frame-scale">
              <ChromeWindow width={1200} height={760} url="myesolclass.com/learn">
                <DesktopApp />
              </ChromeWindow>
              <RewardToast data={reward} onClose={() => setReward(null)} desktop />
            </div>
          )}
        </div>
      </div>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
