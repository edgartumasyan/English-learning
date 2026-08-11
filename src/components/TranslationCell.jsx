function TranslationCell({ translation, language, visible, onToggle }) {
  return (
    <div className="translation-cell" onClick={onToggle}>
      {visible ? (
        <span className="translation-text">{translation}</span>
      ) : (
        <span className="translation-hidden">Click to reveal {language}</span>
      )}
    </div>
  );
}

export default TranslationCell;
