import { useState, useEffect, useCallback } from "react";
import WordTable from "./components/WordTable";
import AddWordForm from "./components/AddWordForm";
import { getWords, addWord } from "./data";
import "./App.css";

const PROFILES = [
  { key: "my", label: "Edgar" },
  { key: "caroline", label: "Caroline" },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [profile, setProfile] = useState(
    () => localStorage.getItem("vocab-profile") || "my",
  );
  const [words, setWords] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    setWords(getWords(profile));
    setIsShuffled(false);
  }, [profile]);

  const handleProfileChange = (key) => {
    setProfile(key);
    localStorage.setItem("vocab-profile", key);
  };

  const handleShuffle = useCallback(() => {
    setWords((prev) => shuffleArray(prev));
    setIsShuffled(true);
  }, []);

  const handleResetOrder = useCallback(() => {
    setWords((prev) => [...prev].sort((a, b) => a.id - b.id));
    setIsShuffled(false);
  }, []);

  const handleAddWord = ({ english, russian, armenian }) => {
    addWord(profile, { english, russian, armenian });
    setWords(getWords(profile));
    setIsShuffled(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>English Vocabulary Trainer</h1>
        <p className="app-subtitle">
          Read the English word, think of the translation, then click to reveal
        </p>
        <div className="profile-switcher">
          {PROFILES.map((p) => (
            <button
              key={p.key}
              className={`btn btn-profile ${profile === p.key ? "btn-profile-active" : ""}`}
              onClick={() => handleProfileChange(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>
      <main className="app-main">
        <AddWordForm onAdd={handleAddWord} />
        <WordTable
          words={words}
          isShuffled={isShuffled}
          onShuffle={handleShuffle}
          onResetOrder={handleResetOrder}
          pdfSource={profile}
        />
      </main>
    </div>
  );
}

export default App;
