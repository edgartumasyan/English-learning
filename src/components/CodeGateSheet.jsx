import { useState } from "react";

// Access-code gate shared by the add and delete flows. `title` describes the
// pending action; `onVerify` returns true when the code is accepted.
function CodeGateSheet({ title, onClose, onVerify }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onVerify(code.trim())) {
      setError(true);
    }
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <form
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="sheet-handle" />
        <h2 className="sheet-title">{title}</h2>
        <input
          type="text"
          className="sheet-input code-input"
          placeholder="6-character code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          maxLength={6}
          autoFocus
        />
        {error && (
          <p className="sheet-error strong">Access denied. Incorrect code.</p>
        )}
        <button type="submit" className="sheet-submit">
          Continue
        </button>
      </form>
    </div>
  );
}

export default CodeGateSheet;
