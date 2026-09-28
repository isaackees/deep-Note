// controllers/notes.controller.js
const { date, success } = require("zod");
const Note = require("../models/note.js");
const User = require("../models/User.js");
//   const getAllNotes = async (req, res) => {
//   try {
//     // 1. Destructure all query params with defaults
//     const { 
//       search, 
//       sortBy = "createdAt", 
//       order = "desc" 
//     } = req.query;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // 2. Build the filter
//     const filter = search 
//       ? { title: { $regex: search, $options: "i" } } 
//       : {};

//     // 3. Build the sort object
//     const sortOrder = order === "asc" ? 1 : -1;

//     // 4. Execute the query with ALL features
//     const notes = await Note.find(filter)
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(limit);

//     const total = await Note.countDocuments(filter);

//     // 5. Send the response
//     res.status(200).json({
//       success: true,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       },
//       data: notes
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
async function getAllNotes(req, res, next) {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
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

// async function createNote(req, res) {
//   try {
//     const { title, content } = req.body;
//     const newNote = await Note.create({ title, content });
//     res.status(201).json(newNote);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// }

// async function createNote(req, res, next) {
//   try {
//     const { title, content } = req.body;
//     const note = await Note.create({ title, content, user: req.user.id });
//     res.status(201).json({ success: true, data: note });
//   } catch (error) {
//     next(error);
//   }
// }

async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.user.id });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
}

// async function updateNote(req, res) {
//   try {
//     const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,          // return the updated document, not the old one
//       runValidators: true, // re-run schema validation on update
//     });
//     if (!updated) {
//       return res.status(404).json({ error: "Note not found" });
//     }
//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// }

async function updateNote(req, res, next) {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    Object.assign(note, req.body);
    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
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

const getNoteStats = async (req, res, next) => {
  try {
    //get total count of note
    const totalNotes = await Note.countDocuments()
    //gets todays date boundaries
    const today = new Date()
    today.setHours(0,0,0,0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() +1)

    //count note created bte today and tomorrow
    const noteCreatedToday = await Note.countDocuments( {
      createdAt : {
        $gte: today,
        $lt: tomorrow
      },
  })
  // return the standard consistent shape
  res.status(200).json({
    success: true,
    date: {
      totalNotes,
      noteCreatedToday,
    }
  })
  } catch (error) {
    next(error)
  }
}

module.exports = { getNoteStats, getAllNotes,getAllUsers, getNoteById, createNote, updateNote, deleteNote };