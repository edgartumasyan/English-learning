import { memo } from "react";
import { speakWord } from "../speak";

const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

// A single word card: number, English, pronounce button, then the Armenian and
// Russian translations — all on one wrapping flex row (mobile redesign).
const WordCardRow = memo(function WordCardRow({ word, index, vis, onToggle }) {
  return (
    <div className="word-card">
      <div className="card-index">{index}</div>
      <div
        className={vis.english ? "card-english shown" : "card-english hidden"}
        onClick={() => onToggle(word.id, "english")}
      >
        {vis.english ? word.english : "Tap to reveal"}
      </div>
      <button
        className="speak-btn"
        onClick={() => speakWord(word.english)}
        aria-label={`Pronounce ${word.english}`}
      >
        <SpeakerIcon />
      </button>
      <div
        className={vis.armenian ? "chip chip-a shown" : "chip hidden"}
        onClick={() => onToggle(word.id, "armenian")}
      >
        {vis.armenian ? word.armenian : "Armenian"}
      </div>
      <div
        className={vis.russian ? "chip chip-r shown" : "chip hidden"}
        onClick={() => onToggle(word.id, "russian")}
      >
        {vis.russian ? word.russian : "Russian"}
      </div>
    </div>
  );
});

export default WordCardRow;
