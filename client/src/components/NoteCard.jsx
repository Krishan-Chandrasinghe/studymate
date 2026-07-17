import { getSubjectColor } from '../utils/subjectColors'

function NoteCard({ note, onDelete }) {
  const badge = getSubjectColor(note.subject)
  const createdLabel = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="note-card">
      <header className="note-card-header">
        <span
          className="subject-badge"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {note.subject}
        </span>
        <button
          type="button"
          className="note-delete"
          aria-label={`Delete note: ${note.title}`}
          onClick={() => onDelete(note.id)}
        >
          &times;
        </button>
      </header>

      <h3 className="note-title">{note.title}</h3>
      <p className="note-content">{note.content}</p>

      <footer className="note-card-footer">
        <span>{createdLabel}</span>
      </footer>
    </article>
  )
}

export default NoteCard
