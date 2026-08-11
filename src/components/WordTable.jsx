import { useState, useCallback, useMemo } from "react";
import { List } from "react-window";
import VirtualRow from "./VirtualRow";

const ROW_HEIGHT = 52;
const LIST_HEIGHT = 600;

function WordTable({ words, isShuffled, onShuffle, onResetOrder, pdfSource }) {
  const [visibility, setVisibility] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      const { exportWordsToPdf } = await import("../exportPdf");
      const ordered = [...words].sort((a, b) => a.id - b.id);
      await exportWordsToPdf(ordered, pdfSource);
    } finally {
      setIsExporting(false);
    }
  }, [words, pdfSource]);

  const handleRevealAll = useCallback(() => {
    const next = {};
    words.forEach((w) => {
      next[w.id] = { english: true, russian: true, armenian: true };
    });
    setVisibility(next);
  }, [words]);

  const handleHideAll = useCallback(() => {
    setVisibility({});
  }, []);

  const toggleField = useCallback((wordId, field) => {
    setVisibility((prev) => {
      const current = prev[wordId] || {};
      return {
        ...prev,
        [wordId]: { ...current, [field]: !current[field] },
      };
    });
  }, []);

  const rowProps = useMemo(
    () => ({ words, visibility, onToggle: toggleField }),
    [words, visibility, toggleField],
  );

  if (words.length === 0) {
    return (
      <div className="table-container">
        <p style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
          No words yet. Add your first word above.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-controls">
        <button className="btn btn-reveal" onClick={handleRevealAll}>
          Show All Translations
        </button>
        <button className="btn btn-hide" onClick={handleHideAll}>
          Hide All Translations
        </button>
        {isShuffled ? (
          <button className="btn btn-reset-order" onClick={onResetOrder}>
            Reset Order
          </button>
        ) : (
          <button className="btn btn-shuffle" onClick={onShuffle}>
            Shuffle
          </button>
        )}
        <button
          className="btn btn-pdf"
          onClick={handleDownloadPdf}
          disabled={isExporting}
        >
          {isExporting ? "Generating…" : "Download PDF"}
        </button>
        <span className="word-count">{words.length} words</span>
      </div>
      <div className="table-header">
        <div className="header-cell index-header">#</div>
        <div className="header-cell english-header">English</div>
        <div className="header-cell translation-header">Armenian</div>
        <div className="header-cell translation-header">Russian</div>
      </div>
      <List
        rowComponent={VirtualRow}
        rowCount={words.length}
        rowHeight={ROW_HEIGHT}
        rowProps={rowProps}
        overscanCount={10}
        style={{ height: LIST_HEIGHT }}
      />
    </div>
  );
}

export default WordTable;
