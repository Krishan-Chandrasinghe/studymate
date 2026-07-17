const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options) {
  const res = await fetch(`${API_BASE_URL}/api/notes${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`)
  }

  return data
}

export function fetchNotes() {
  return request('', { method: 'GET' })
}

export function createNote(note) {
  return request('', { method: 'POST', body: JSON.stringify(note) })
}

export function deleteNote(id) {
  return request(`/${id}`, { method: 'DELETE' })
}

export function summarizeNote(id) {
  return request(`/${id}/summarize`, { method: 'POST' })
}
