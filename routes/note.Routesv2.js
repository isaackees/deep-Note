// routes/notes.routes.js
const express = require("express");
const { createNoteSchema } = require("../validators/note.validator")
const validate = require("../middleware/validate")
const {register, login, refresh} = require("../controllers/auth.controller.js")
const protect = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js")
const router = express.Router();
const {
  getNoteStats,
  getAllNotes,
  getAllUsers,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/note.controllerv2.js");

router.get("/stats", getNoteStats);
router.get("/", protect, getAllNotes);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, getNoteById);
router.post("/", protect, validate(createNoteSchema), createNote);
router.post("/refresh", refresh)
router.post("/auth/register", register);
router.post("/auth/login", login);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;