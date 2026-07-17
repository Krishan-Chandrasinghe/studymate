import { useState } from 'react'
import { getSubjectColor } from '../utils/subjectColors'
import { summarizeNote } from '../api/notes'
import Quiz from './Quiz'

function NoteCard({ note, onDelete, onNoteUpdated }) {
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summarizeError, setSummarizeError] = useState('')

  const badge = getSubjectColor(note.subject)
  const createdLabel = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const summaryBullets = note.summary ? note.summary.split('\n').filter(Boolean) : []

  const handleSummarize = async () => {
    setIsSummarizing(true)
    setSummarizeError('')

    try {
      const updatedNote = await summarizeNote(note._id)
      onNoteUpdated(updatedNote)
    } catch (err) {
      setSummarizeError(err.message)
    } finally {
      setIsSummarizing(false)
    }
  }

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
          onClick={() => onDelete(note._id)}
        >
          &times;
        </button>
      </header>

      <h3 className="note-title">{note.title}</h3>
      <p className="note-content">{note.content}</p>

      {summaryBullets.length > 0 && (
        <div className="note-summary">
          <h4 className="note-summary-title">✨ Summary</h4>
          <ul>
            {summaryBullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(note.quiz) && note.quiz.length > 0 && <Quiz quiz={note.quiz} />}

      <footer className="note-card-footer">
        <span>{createdLabel}</span>
        <button
          type="button"
          className="btn btn-ghost-quiz summarize-btn"
          onClick={handleSummarize}
          disabled={isSummarizing}
        >
          {isSummarizing ? 'Summarizing…' : '✨ Summarize'}
        </button>
      </footer>

      {summarizeError && <p className="form-error">{summarizeError}</p>}
    </article>
  )
}

export default NoteCard
