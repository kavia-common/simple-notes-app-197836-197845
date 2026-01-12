import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import "./App.css";

const STORAGE_KEY = "simple-notes:notes:v1";

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {number} createdAt
 * @property {number} updatedAt
 */

function createId() {
  // Good-enough unique id for local state/localStorage usage.
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadNotesFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // If storage is full or blocked, we silently ignore (app still works in-memory).
  }
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Note[], Function]} */
  const [notes, setNotes] = useState(() => loadNotesFromStorage());
  const [editingNoteId, setEditingNoteId] = useState(null);

  const editingNote = useMemo(() => {
    if (!editingNoteId) return null;
    return notes.find((n) => n.id === editingNoteId) || null;
  }, [editingNoteId, notes]);

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  // PUBLIC_INTERFACE
  const handleCreateNote = ({ title, content }) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      return {
        ok: false,
        error: "Please enter a title or content.",
      };
    }

    const now = Date.now();
    const newNote = {
      id: createId(),
      title: trimmedTitle,
      content: trimmedContent,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    return { ok: true };
  };

  // PUBLIC_INTERFACE
  const handleUpdateNote = ({ title, content }) => {
    if (!editingNoteId) return { ok: false, error: "No note selected to edit." };

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      return {
        ok: false,
        error: "Please enter a title or content.",
      };
    }

    const now = Date.now();

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNoteId
          ? { ...n, title: trimmedTitle, content: trimmedContent, updatedAt: now }
          : n
      )
    );

    setEditingNoteId(null);
    return { ok: true };
  };

  // PUBLIC_INTERFACE
  const handleEditRequest = (noteId) => {
    setEditingNoteId(noteId);
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setEditingNoteId((prev) => (prev === noteId ? null : prev));
  };

  // PUBLIC_INTERFACE
  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  return (
    <div className="App">
      <Header />
      <main className="AppMain">
        <section className="Layout">
          <div className="LeftPane" aria-label="Note editor">
            <NoteForm
              mode={editingNote ? "edit" : "create"}
              initialValues={
                editingNote
                  ? { title: editingNote.title, content: editingNote.content }
                  : { title: "", content: "" }
              }
              onCreate={handleCreateNote}
              onUpdate={handleUpdateNote}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div className="RightPane" aria-label="Notes list">
            <NotesList
              notes={notes}
              editingNoteId={editingNoteId}
              onEdit={handleEditRequest}
              onDelete={handleDeleteNote}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
