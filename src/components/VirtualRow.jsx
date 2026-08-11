import { memo } from "react";
import TranslationCell from "./TranslationCell";

// Keep a reference so the utterance isn't garbage-collected mid-speech (Chrome bug).
let currentUtterance = null;

function speakWord(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  // Chrome sometimes leaves the synth paused after the tab is idle/backgrounded.
  synth.cancel();
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  currentUtterance = utterance;

  // Voices load asynchronously; if none are ready yet, wait for them once.
  if (synth.getVoices().length === 0) {
    synth.addEventListener(
      "voiceschanged",
      () => synth.speak(utterance),
      { once: true }
    );
  } else {
    synth.speak(utterance);
  }
}

const VirtualRow = memo(function VirtualRow({ index, style, words, visibility, onToggle }) {
  const word = words[index];
  const vis = visibility[word.id] || {};

  return (
    <div style={style}>
      <div className="word-row">
        <div className="index-cell">{index + 1}</div>
        <div className="english-cell english-toggle">
          {vis.english ? (
            <span onClick={() => onToggle(word.id, "english")}>{word.english}</span>
          ) : (
            <span
              className="translation-hidden"
              onClick={() => onToggle(word.id, "english")}
            >
              Click to reveal English
            </span>
          )}
          <button
            className="speak-btn"
            onClick={() => speakWord(word.english)}
            aria-label={`Pronounce ${word.english}`}
            title="Listen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          </button>
        </div>
        <TranslationCell
          translation={word.armenian}
          language="Armenian"
          visible={!!vis.armenian}
          onToggle={() => onToggle(word.id, "armenian")}
        />
        <TranslationCell
          translation={word.russian}
          language="Russian"
          visible={!!vis.russian}
          onToggle={() => onToggle(word.id, "russian")}
        />
      </div>
    </div>
  );
});

export default VirtualRow;
