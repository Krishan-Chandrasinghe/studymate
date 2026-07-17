const isBlank = (value) => typeof value !== 'string' || value.trim().length === 0;

function validateNote(req, res, next) {
  const { title, subject, content } = req.body;

  if (isBlank(title) || isBlank(content)) {
    return res.status(400).json({ error: 'Title and content fields are strictly required.' });
  }

  if (isBlank(subject)) {
    return res.status(400).json({ error: 'Subject field is strictly required.' });
  }

  next();
}

module.exports = validateNote;
