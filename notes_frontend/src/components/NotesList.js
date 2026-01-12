import React from "react";
import NoteCard from "./NoteCard";

// PUBLIC_INTERFACE
function NotesList({ notes, editingNoteId, onEdit, onDelete }) {
  /** List of notes with empty state. */
  return (
    <section className="Card">
      <div className="CardHeader CardHeaderRow">
        <div>
          <h2 className="CardTitle">Your notes</h2>
          <p className="CardSubtitle">
            {notes.length === 0
              ? "No notes yet."
              : `Showing ${notes.length} note${notes.length === 1 ? "" : "s"}.`}
          </p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="EmptyState">
          <div className="EmptyStateTitle">Nothing here yet</div>
          <div className="EmptyStateText">
            Add your first note using the form.
          </div>
        </div>
      ) : (
        <ul className="NotesGrid" aria-label="Notes">
          {notes.map((note) => (
            <li key={note.id} className="NotesGridItem">
              <NoteCard
                note={note}
                isEditing={editingNoteId === note.id}
                onEdit={() => onEdit(note.id)}
                onDelete={() => onDelete(note.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default NotesList;
