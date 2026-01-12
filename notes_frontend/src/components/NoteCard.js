import React, { useMemo } from "react";

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
function NoteCard({ note, isEditing, onEdit, onDelete }) {
  /** Single note display with edit/delete actions. */
  const title = note.title?.trim();
  const content = note.content?.trim();

  const meta = useMemo(() => {
    const updated = formatDateTime(note.updatedAt);
    const created = formatDateTime(note.createdAt);
    if (updated && created && updated !== created) return `Updated ${updated}`;
    if (created) return `Created ${created}`;
    return "";
  }, [note.createdAt, note.updatedAt]);

  return (
    <article className={`NoteCard ${isEditing ? "NoteCardEditing" : ""}`}>
      <div className="NoteCardTop">
        <div className="NoteCardText">
          <h3 className="NoteCardTitle">{title || "Untitled"}</h3>
          <p className="NoteCardContent">{content || "No content."}</p>
        </div>

        <div className="NoteCardActions">
          <button className="IconBtn IconBtnPrimary" type="button" onClick={onEdit}>
            Edit
          </button>
          <button className="IconBtn IconBtnDanger" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      {meta ? <div className="NoteCardMeta">{meta}</div> : null}
    </article>
  );
}

export default NoteCard;
