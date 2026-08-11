import WordCardRow from "./WordCardRow";

function BrowseView({
  words,
  count,
  visibility,
  onToggle,
  onDelete,
  allShown,
  onToggleShowAll,
  shuffled,
  onToggleShuffle,
  onDownloadPdf,
  pdfLabel,
}) {
  return (
    <div className="browse">
      <div className="browse-actions">
        <div className="word-count">{count} words</div>
        <div className="action-row">
          <button
            className={`action-btn ${allShown ? "" : "accent"}`}
            onClick={onToggleShowAll}
          >
            {allShown ? "Hide All" : "Show All"}
          </button>
          <button
            className={`action-btn ${shuffled ? "" : "accent2"}`}
            onClick={onToggleShuffle}
          >
            {shuffled ? "Reset Order" : "Shuffle"}
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
