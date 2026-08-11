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

function Toggle({ label, on, onClick }) {
  return (
    <button
      type="button"
      className="practice-toggle"
      onClick={onClick}
      aria-pressed={on}
    >
      <span>{label}</span>
      <span className={`switch ${on ? "on" : ""}`}>
        <span className="knob" />
      </span>
    </button>
  );
}

function PracticeView({
  word,
  index,
  total,
  showFront,
  onFlip,
  onPrev,
  onNext,
  shuffle,
  onToggleShuffle,
  hideWord,
  onToggleHideWord,
}) {
  return (
    <div className="practice">
      <div className="practice-controls">
        <div className="practice-count">
          Card {total ? index + 1 : 0} of {total}
        </div>
        <div className="practice-toggles">
          <Toggle label="Shuffle" on={shuffle} onClick={onToggleShuffle} />
          <Toggle label="Hide word" on={hideWord} onClick={onToggleHideWord} />
        </div>
      </div>

      <div
        key={`${index}-${showFront}`}
        className="flashcard"
        onClick={onFlip}
      >
        {showFront ? (
          hideWord ? (
            <>
              <div className="flash-word masked">? ? ? ? ?</div>
              <div className="flash-hint">Tap to reveal translation</div>
            </>
          ) : (
            <>
              <div className="flash-word">{word.english}</div>
              <div className="flash-hint">Tap to reveal</div>
            </>
          )
        ) : (
          <div className="flash-back">
            {hideWord && <div className="flash-back-word">{word.english}</div>}
            <div className="reveal-chip chip-a">{word.armenian}</div>
            <div className="reveal-chip chip-r">{word.russian}</div>
          </div>
        )}
      </div>

      <button className="listen-btn" onClick={() => speakWord(word.english)}>
        <SpeakerIcon />
        Listen
      </button>

      <div className="practice-nav">
        <button className="nav-btn" onClick={onPrev}>
          Back
        </button>
        <button className="nav-btn primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PracticeView;
