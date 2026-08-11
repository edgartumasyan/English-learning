import { useState } from "react";

// First step of the add-word flow: the user must enter the access code before
// the form is shown. `onVerify` returns true when the code is accepted.
function CodeGateSheet({ onClose, onVerify }) {
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
        <h2 className="sheet-title">Please add the code to add the word</h2>
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
