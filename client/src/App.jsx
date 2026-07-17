import { useEffect, useMemo, useState } from 'react'
import NoteForm from './components/NoteForm'
import NoteCard from './components/NoteCard'
import './App.css'

const THEME_STORAGE_KEY = 'studymate-theme'

const SEED_NOTES = [
  {
    id: 'seed-1',
    title: 'Photosynthesis Recap',
    subject: 'Biology',
    content:
      'Light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH, which feed the Calvin cycle in the stroma.',
    createdAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Big-O Cheat Sheet',
    subject: 'Computer Science',
    content:
      'Binary search is O(log n). Hash map lookups are O(1) average case. Always double-check worst-case behavior before assuming average case.',
    createdAt: '2026-07-12T14:30:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'French Revolution Timeline',
    subject: 'History',
    content:
      'Storming of the Bastille (1789) → Reign of Terror (1793-94) → Rise of Napoleon (1799). Key turning point: execution of Louis XVI in 1793.',
    createdAt: '2026-07-14T18:15:00.000Z',
  },
]

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(getPreferredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotes(SEED_NOTES)
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const handleAddNote = (fields) => {
    const newNote = {
      ...fields,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
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
                <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
