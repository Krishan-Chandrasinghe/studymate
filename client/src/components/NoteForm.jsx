import { useState } from 'react'

const EMPTY_FIELDS = { title: '', subject: '', content: '' }

function NoteForm({ onAddNote }) {
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const title = fields.title.trim()
    const subject = fields.subject.trim()
    const content = fields.content.trim()

    if (!title || !subject || !content) {
      setError('Title, subject, and content are all required.')
      return
    }

    onAddNote({ title, subject, content })
    setFields(EMPTY_FIELDS)
    setError('')
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="note-form-row">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Photosynthesis Recap"
            value={fields.title}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="e.g. Biology"
            value={fields.subject}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={4}
          placeholder="Write or paste your notes here..."
          value={fields.content}
          onChange={handleChange}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Add Note
      </button>
    </form>
  )
}

export default NoteForm
