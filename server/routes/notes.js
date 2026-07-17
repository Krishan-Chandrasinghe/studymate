const express = require('express');
const Note = require('../models/Note');
const validateNote = require('../middleware/validateNote');

const router = express.Router();

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// POST /api/notes
router.post('/', validateNote, async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim(),
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

// PUT /api/notes/:id
router.put('/:id', validateNote, async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), subject: subject.trim(), content: content.trim() },
      { new: true, runValidators: true },
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json(note);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note id.' });
    }
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json({ message: 'Note deleted successfully.', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note id.' });
    }
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

module.exports = router;
