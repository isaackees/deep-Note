// controllers/notes.controller.js
const Note = require("../models/note.js");

async function getAllNotes(req, res) {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = await Note.create({ title, content });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateNote(req, res) {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // return the updated document, not the old one
      runValidators: true, // re-run schema validation on update
    });
    if (!updated) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteNote(req, res) {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };