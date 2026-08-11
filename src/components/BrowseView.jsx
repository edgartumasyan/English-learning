import { useLayoutEffect, useRef, useState } from "react";
import { List } from "react-window";
import WordCardRow from "./WordCardRow";

const ROW_HEIGHT = 128;

// react-window needs an explicit pixel height. We measure the flex area left
// under the sticky header/action bar and keep it in sync on resize.
function useFillHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setHeight(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, height];
}

function BrowseView({
  words,
  visibility,
  onToggle,
  onRevealAll,
  onHideAll,
  onShuffle,
  onDownloadPdf,
  pdfLabel,
}) {
  const [listRef, listHeight] = useFillHeight();
  const rowProps = { words, visibility, onToggle };

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
      <div className="browse-list" ref={listRef}>
        {listHeight > 0 && (
          <List
            rowComponent={WordCardRow}
            rowCount={words.length}
            rowHeight={ROW_HEIGHT}
            rowProps={rowProps}
            overscanCount={6}
            style={{ height: listHeight }}
          />
        )}
      </div>
    </div>
  );
}

export default BrowseView;
