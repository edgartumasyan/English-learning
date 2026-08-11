const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BrowseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const PracticeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="14" height="10" rx="2" transform="rotate(-6 10 12)" />
    <rect x="7" y="5" width="14" height="10" rx="2" />
  </svg>
);

const MODE_ICONS = { browse: BrowseIcon, practice: PracticeIcon };

// Right-side slide-in drawer for choosing the word list (profile) and study
// mode. Selecting either closes the drawer (handled by the parent callbacks).
function MenuDrawer({
  profiles,
  profile,
  onSelectProfile,
  tabs,
  mode,
  onSelectMode,
  onClose,
}) {
  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="menu-head">
          <div className="brand">
            <div className="brand-mark small">
              <span className="mark-a" />
              <span className="mark-b" />
            </div>
            <div className="menu-brand-name">Fluent</div>
          </div>
          <button className="menu-close" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="menu-section">
          <div className="menu-label">Word List</div>
          <div className="menu-items">
            {profiles.map((p) => (
              <button
                key={p.key}
                className={`menu-item ${profile === p.key ? "active" : ""}`}
                onClick={() => onSelectProfile(p.key)}
              >
                <span className="menu-avatar">{p.label[0]}</span>
                <span className="menu-item-label">{p.label}</span>
                {profile === p.key && <CheckIcon />}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-label">Study Mode</div>
          <div className="menu-items">
            {tabs.map((tb) => {
              const Icon = MODE_ICONS[tb.key];
              return (
                <button
                  key={tb.key}
                  className={`menu-item ${mode === tb.key ? "active" : ""}`}
                  onClick={() => onSelectMode(tb.key)}
                >
                  <span className="menu-icon">{Icon && <Icon />}</span>
                  <span className="menu-item-label">{tb.label}</span>
                  {mode === tb.key && <CheckIcon />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDrawer;
