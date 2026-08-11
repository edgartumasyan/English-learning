import { useState } from "react";

const EMPTY = { english: "", armenian: "", russian: "" };

function AddWordSheet({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const change = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = {
      english: form.english.trim(),
      armenian: form.armenian.trim(),
      russian: form.russian.trim(),
    };
    if (!trimmed.english || !trimmed.armenian || !trimmed.russian) {
      setError("All three fields are required.");
      return;
    }
    onAdd(trimmed);
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <form
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="sheet-handle" />
        <h2 className="sheet-title">Add New Word</h2>
        <input
          type="text"
          className="sheet-input"
          placeholder="English"
          value={form.english}
          onChange={change("english")}
          autoFocus
        />
        <input
          type="text"
          className="sheet-input"
          placeholder="Armenian"
          value={form.armenian}
          onChange={change("armenian")}
        />
        <input
          type="text"
          className="sheet-input"
          placeholder="Russian"
          value={form.russian}
          onChange={change("russian")}
        />
        {error && <p className="sheet-error">{error}</p>}
        <button type="submit" className="sheet-submit">
          Add Word
        </button>
      </form>
    </div>
  );
}

export default AddWordSheet;
