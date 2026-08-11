// Landing screen reached by tapping the brand: big logo, tagline, and shortcuts
// into Practice / Browse.
function HomeView({ wordCount, profileLabel, onPractice, onBrowse }) {
  return (
    <div className="home">
      <div className="home-logo">
        <span className="mark-a" />
        <span className="mark-b" />
      </div>
      <div>
        <div className="home-title">Fluent</div>
        <div className="home-subtitle">
          Practice English vocabulary with Armenian and Russian translations.
        </div>
      </div>
      <div className="home-actions">
        <button className="home-btn primary" onClick={onPractice}>
          Start Practicing
        </button>
        <button className="home-btn" onClick={onBrowse}>
          Browse Words
        </button>
      </div>
      <div className="home-footer">
        {wordCount} words · {profileLabel}'s list
      </div>
    </div>
  );
}

export default HomeView;
