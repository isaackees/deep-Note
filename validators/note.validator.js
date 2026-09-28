const { z } = require("zod");

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "title cannot exceed 100 characters"),
  content: z.string().min(1, "Content is required"),
});

module.exports = { createNoteSchema };