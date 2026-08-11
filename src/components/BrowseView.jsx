import WordCardRow from "./WordCardRow";

function BrowseView({
  words,
  visibility,
  onToggle,
  onDelete,
  onRevealAll,
  onHideAll,
  onShuffle,
  onDownloadPdf,
  pdfLabel,
}) {
  return (
    <div className="browse">
      <div className="browse-actions">
        <div className="word-count">{words.length} words</div>
        <div className="action-row">
          <button className="action-btn accent" onClick={onRevealAll}>
            Show All
          </button>
          <button className="action-btn" onClick={onHideAll}>
            Hide All
          </button>
          <button className="action-btn accent2" onClick={onShuffle}>
            Shuffle
          </button>
          <button className="action-btn push" onClick={onDownloadPdf}>
            {pdfLabel}
          </button>
        </div>
      </div>
      <div className="browse-list">
        {words.map((word, i) => (
          <WordCardRow
            key={word.id}
            word={word}
            index={i + 1}
            vis={visibility[word.id] || {}}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default BrowseView;
