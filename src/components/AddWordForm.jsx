import { useState } from "react";

const INITIAL_FORM = { english: "", russian: "", armenian: "" };

function AddWordForm({ onAdd }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = {
      english: form.english.trim(),
      russian: form.russian.trim(),
      armenian: form.armenian.trim(),
    };

    if (!trimmed.english || !trimmed.russian || !trimmed.armenian) {
      setError("All three fields are required.");
      return;
    }

    await onAdd(trimmed);
    setForm(INITIAL_FORM);
  };

  return (
    <form className="add-word-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add New Word</h2>
      <div className="form-fields">
        <input
          type="text"
          className="form-input"
          placeholder="English"
          value={form.english}
          onChange={handleChange("english")}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Russian"
          value={form.russian}
          onChange={handleChange("russian")}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Armenian"
          value={form.armenian}
          onChange={handleChange("armenian")}
        />
        <button type="submit" className="btn btn-add">
          Add Word
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default AddWordForm;
