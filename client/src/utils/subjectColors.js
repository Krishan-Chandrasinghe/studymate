// Deterministic subject -> badge color mapping so the same subject
// always renders the same accent, without maintaining a manual lookup table.

const PALETTE = [
  { bg: 'rgba(52, 211, 153, 0.16)', text: '#34d399' }, // emerald
  { bg: 'rgba(245, 158, 11, 0.16)', text: '#f59e0b' }, // amber
  { bg: 'rgba(96, 165, 250, 0.16)', text: '#60a5fa' }, // blue
  { bg: 'rgba(244, 114, 182, 0.16)', text: '#f472b6' }, // pink
  { bg: 'rgba(167, 139, 250, 0.16)', text: '#a78bfa' }, // violet
  { bg: 'rgba(251, 113, 133, 0.16)', text: '#fb7185' }, // rose
]

export function getSubjectColor(subject) {
  const normalized = (subject || '').trim().toLowerCase()
  if (!normalized) return PALETTE[0]

  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
  }

  return PALETTE[hash % PALETTE.length]
}
