import React, { useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
function NoteForm({ mode, initialValues, onCreate, onUpdate, onCancelEdit }) {
  /**
   * Form for creating or editing a note.
   * - Controlled inputs
   * - Basic validation: title or content must be non-empty
   */
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  useEffect(() => {
    // When switching between edit/create (or editing another note), reset fields.
    setTitle(initialValues?.title ?? "");
    setContent(initialValues?.content ?? "");
    setError("");
  }, [initialValues]);

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 || content.trim().length > 0;
  }, [title, content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const action = isEdit ? onUpdate : onCreate;
    const result = action({ title, content });

    if (!result?.ok) {
      setError(result?.error || "Please check the form and try again.");
      return;
    }

    if (!isEdit) {
      // Clear after successful create.
      setTitle("");
      setContent("");
    }
  };

  return (
    <section className="Card">
      <div className="CardHeader">
        <h2 className="CardTitle">{isEdit ? "Edit note" : "Add a note"}</h2>
        <p className="CardSubtitle">
          {isEdit
            ? "Update the title or content, then save."
            : "Write something down—saved automatically after you add it."}
        </p>
      </div>

      <form className="Form" onSubmit={handleSubmit}>
        <div className="Field">
          <label className="Label" htmlFor="note-title">
            Title
          </label>
          <input
            id="note-title"
            className="Input"
            type="text"
            value={title}
            placeholder="e.g., Grocery list"
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="Field">
          <label className="Label" htmlFor="note-content">
            Content
          </label>
          <textarea
            id="note-content"
            className="Textarea"
            value={content}
            placeholder="Write your note here..."
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        {error ? (
          <div className="FormError" role="alert" aria-live="polite">
            {error}
          </div>
        ) : null}

        <div className="FormActions">
          <button className="Btn BtnPrimary" type="submit" disabled={!canSubmit}>
            {isEdit ? "Save changes" : "Add note"}
          </button>

          {isEdit ? (
            <button
              className="Btn BtnGhost"
              type="button"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <p className="FormHint">Validation: title or content must be non-empty.</p>
      </form>
    </section>
  );
}

export default NoteForm;
