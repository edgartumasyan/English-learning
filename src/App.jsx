import { useState, useEffect, useCallback, useMemo } from "react";
import BrowseView from "./components/BrowseView";
import PracticeView from "./components/PracticeView";
import CodeGateSheet from "./components/CodeGateSheet";
import AddWordSheet from "./components/AddWordSheet";
import { getWords, addWord } from "./data";
import { themeVars } from "./theme";
import "./App.css";

const PROFILES = [
  { key: "my", label: "Edgar" },
  { key: "caroline", label: "Caroline" },
];

const TABS = [
  { key: "browse", label: "Browse" },
  { key: "practice", label: "Practice" },
];

// Access code required before the add-word form is revealed.
const ACCESS_CODE = "123456";

const EMPTY_WORD = { english: "", armenian: "", russian: "" };

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("lexi-theme") || "dark",
  );
  const [profile, setProfile] = useState(
    () => localStorage.getItem("vocab-profile") || "my",
  );
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState("browse");
  const [visibility, setVisibility] = useState({});
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceFront, setPracticeFront] = useState(true);
  // "closed" → "code" (access gate) → "form" (add word).
  const [gateStep, setGateStep] = useState("closed");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setWords(getWords(profile));
    setVisibility({});
    setPracticeIdx(0);
    setPracticeFront(true);
  }, [profile]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("lexi-theme", next);
      return next;
    });
  }, []);

  const handleProfileChange = (key) => {
    setProfile(key);
    localStorage.setItem("vocab-profile", key);
  };

  const handleModeChange = (key) => {
    setMode(key);
    setPracticeIdx(0);
    setPracticeFront(true);
  };

  const toggleField = useCallback((wordId, field) => {
    setVisibility((prev) => {
      const current = prev[wordId] || {};
      return { ...prev, [wordId]: { ...current, [field]: !current[field] } };
    });
  }, []);

  const revealAll = useCallback(() => {
    setVisibility(() => {
      const next = {};
      words.forEach((w) => {
        next[w.id] = { english: true, russian: true, armenian: true };
      });
      return next;
    });
  }, [words]);

  const hideAll = useCallback(() => setVisibility({}), []);

  const shuffle = useCallback(() => {
    setWords((prev) => shuffleArray(prev));
    setVisibility({});
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      const { exportWordsToPdf } = await import("./exportPdf");
      await exportWordsToPdf(words, profile);
    } finally {
      setIsExporting(false);
    }
  }, [words, profile]);

  const openAdd = () => setGateStep("code");
  const closeAdd = () => setGateStep("closed");

  const verifyCode = (code) => {
    if (code !== ACCESS_CODE) return false;
    setGateStep("form");
    return true;
  };

  const handleAddWord = (fields) => {
    addWord(profile, fields);
    setWords(getWords(profile));
    setGateStep("closed");
  };

  const practiceWord = words[practiceIdx] || EMPTY_WORD;
  const practiceNext = () => {
    setPracticeIdx((i) => (words.length ? (i + 1) % words.length : 0));
    setPracticeFront(true);
  };
  const practicePrev = () => {
    setPracticeIdx((i) =>
      words.length ? (i - 1 + words.length) % words.length : 0,
    );
    setPracticeFront(true);
  };

  const pageStyle = useMemo(() => themeVars(theme), [theme]);

  return (
    <div className="app-page" style={pageStyle}>
      <div className="app-container">
        <header className="app-header">
          <div className="header-inner">
            <div className="brand-row">
              <div className="brand">
                <div className="brand-mark">
                  <span className="mark-a" />
                  <span className="mark-b" />
                </div>
                <div className="brand-name">Fluent</div>
              </div>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>

            <div className="segment">
              {PROFILES.map((p) => (
                <button
                  key={p.key}
                  className={`segment-btn ${profile === p.key ? "active" : ""}`}
                  onClick={() => handleProfileChange(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="tabs">
              {TABS.map((tb) => (
                <button
                  key={tb.key}
                  className={`tab-btn ${mode === tb.key ? "active" : ""}`}
                  onClick={() => handleModeChange(tb.key)}
                >
                  {tb.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {mode === "browse" ? (
          <BrowseView
            words={words}
            visibility={visibility}
            onToggle={toggleField}
            onRevealAll={revealAll}
            onHideAll={hideAll}
            onShuffle={shuffle}
            onDownloadPdf={handleDownloadPdf}
            pdfLabel={isExporting ? "Generating…" : "PDF"}
          />
        ) : (
          <PracticeView
            word={practiceWord}
            index={practiceIdx}
            total={words.length}
            showFront={practiceFront}
            onFlip={() => setPracticeFront((f) => !f)}
            onPrev={practicePrev}
            onNext={practiceNext}
          />
        )}

        <button className="fab" onClick={openAdd} aria-label="Add word">
          +
        </button>

        {gateStep === "code" && (
          <CodeGateSheet onClose={closeAdd} onVerify={verifyCode} />
        )}

        {gateStep === "form" && (
          <AddWordSheet onClose={closeAdd} onAdd={handleAddWord} />
        )}
      </div>
    </div>
  );
}

export default App;
