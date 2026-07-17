import { useEffect, useMemo, useState } from 'react'
import NoteForm from './components/NoteForm'
import NoteCard from './components/NoteCard'
import { fetchNotes, createNote, deleteNote } from './api/notes'
import './App.css'

const THEME_STORAGE_KEY = 'studymate-theme'

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(getPreferredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAddNote = async (fields) => {
    const newNote = await createNote(fields)
    setNotes((prev) => [newNote, ...prev])
  }

  const handleDeleteNote = async (id) => {
    await deleteNote(id)
    setNotes((prev) => prev.filter((note) => note._id !== id))
  }

  const handleNoteUpdated = (updatedNote) => {
    setNotes((prev) => prev.map((note) => (note._id === updatedNote._id ? updatedNote : note)))
  }

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return notes

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query),
    )
  }, [notes, searchQuery])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-logo">
          Study<span>Mate</span>
        </h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>Add a note</h2>
          <NoteForm onAddNote={handleAddNote} />
        </section>

        <section className="notes-section">
          <div className="notes-toolbar">
            <h2>Your notes</h2>
            <input
              type="search"
              className="search-input"
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search notes"
            />
          </div>

          {loading ? (
            <div className="state-message loading-state">
              <span className="spinner" aria-hidden="true" />
              <p>Loading your notes...</p>
            </div>
          ) : loadError ? (
            <div className="state-message empty-state">
              <p>Could not load notes: {loadError}. Is the server running?</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="state-message empty-state">
              <p>
                {notes.length === 0
                  ? 'No notes yet — add your first one!'
                  : 'No notes match your search.'}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onNoteUpdated={handleNoteUpdated}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
