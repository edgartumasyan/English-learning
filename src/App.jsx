import { useState, useEffect, useCallback, useMemo } from "react";
import HomeView from "./components/HomeView";
import BrowseView from "./components/BrowseView";
import PracticeView from "./components/PracticeView";
import MenuDrawer from "./components/MenuDrawer";
import CodeGateSheet from "./components/CodeGateSheet";
import AddWordSheet from "./components/AddWordSheet";
import { getWords, addWord, deleteWord } from "./data";
import { verifyAccessCode } from "./accessCode";
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

const EMPTY_WORD = { english: "", armenian: "", russian: "" };

const labelOf = (list, key) => list.find((x) => x.key === key)?.label ?? "";

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

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
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
  // Practice options: an optional shuffled order over the words, and hiding the
  // English word on the card front.
  const [practiceShuffle, setPracticeShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState(null);
  const [hideWord, setHideWord] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Add/delete both pass through the code gate:
  // "closed" → "code" → ("form" for add | word removed for delete)
  const [gateStep, setGateStep] = useState("closed");
  const [gateAction, setGateAction] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setWords(getWords(profile));
    setVisibility({});
    setPracticeIdx(0);
    setPracticeFront(true);
    setPracticeShuffle(false);
    setShuffleOrder(null);
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
    setMenuOpen(false);
  };

  const handleModeChange = (key) => {
    setMode(key);
    setPracticeIdx(0);
    setPracticeFront(true);
    setMenuOpen(false);
  };

  const goHome = () => handleModeChange("home");

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

  const openAdd = () => {
    setGateAction("add");
    setPendingDeleteId(null);
    setGateStep("code");
  };

  const requestDelete = useCallback((id) => {
    setGateAction("delete");
    setPendingDeleteId(id);
    setGateStep("code");
  }, []);

  const closeGate = () => {
    setGateStep("closed");
    setGateAction(null);
    setPendingDeleteId(null);
  };

  // Resolves to true when the code is accepted so the sheet can show its error.
  const verifyCode = async (code) => {
    if (!(await verifyAccessCode(code))) return false;
    if (gateAction === "delete") {
      deleteWord(profile, pendingDeleteId);
      setWords(getWords(profile));
      closeGate();
      return true;
    }
    setGateStep("form");
    return true;
  };

  const handleAddWord = (fields) => {
    addWord(profile, fields);
    setWords(getWords(profile));
    closeGate();
  };

  const togglePracticeShuffle = () => {
    setPracticeFront(true);
    setPracticeIdx(0);
    if (practiceShuffle) {
      setPracticeShuffle(false);
      setShuffleOrder(null);
      return;
    }
    const order = shuffleArray(words.map((_, i) => i));
    setPracticeShuffle(true);
    setShuffleOrder(order);
  };

  const toggleHideWord = () => setHideWord((h) => !h);

  // With shuffle on, practiceIdx walks the shuffled order; otherwise it indexes
  // words directly.
  const practiceWordIdx =
    practiceShuffle && shuffleOrder && shuffleOrder[practiceIdx] !== undefined
      ? shuffleOrder[practiceIdx]
      : practiceIdx;
  const practiceWord = words[practiceWordIdx] || EMPTY_WORD;
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
  const profileLabel = labelOf(PROFILES, profile);
  const modeLabel = mode === "home" ? "Home" : labelOf(TABS, mode);
  const headerSubtitle = `${profileLabel} · ${modeLabel}`;
  const codeTitle =
    gateAction === "delete"
      ? "Please add the code to delete the word"
      : "Please add the code to add the word";

  return (
    <div className="app-page" style={pageStyle}>
      <div className="app-container">
        <header className="app-header">
          <div className="header-inner">
            <button
              type="button"
              className="brand-col"
              onClick={goHome}
              aria-label="Go to home"
            >
              <div className="brand">
                <div className="brand-mark">
                  <span className="mark-a" />
                  <span className="mark-b" />
                </div>
                <div className="brand-name">Fluent</div>
              </div>
              <div className="header-subtitle">{headerSubtitle}</div>
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        {mode === "home" ? (
          <HomeView
            wordCount={words.length}
            profileLabel={profileLabel}
            onPractice={() => handleModeChange("practice")}
            onBrowse={() => handleModeChange("browse")}
          />
        ) : mode === "browse" ? (
          <BrowseView
            words={words}
            visibility={visibility}
            onToggle={toggleField}
            onDelete={requestDelete}
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
            shuffle={practiceShuffle}
            onToggleShuffle={togglePracticeShuffle}
            hideWord={hideWord}
            onToggleHideWord={toggleHideWord}
          />
        )}

        <button className="fab" onClick={openAdd} aria-label="Add word">
          +
        </button>

        {menuOpen && (
          <MenuDrawer
            profiles={PROFILES}
            profile={profile}
            onSelectProfile={handleProfileChange}
            tabs={TABS}
            mode={mode}
            onSelectMode={handleModeChange}
            onClose={() => setMenuOpen(false)}
          />
        )}

        {gateStep === "code" && (
          <CodeGateSheet
            title={codeTitle}
            onClose={closeGate}
            onVerify={verifyCode}
          />
        )}

        {gateStep === "form" && (
          <AddWordSheet onClose={closeGate} onAdd={handleAddWord} />
        )}
      </div>
    </div>
  );
}

export default App;
