require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const notesRoutes = require("./routes/notes.routes.js");
const notesRoutes2 = require("./routes/note.Routesv2.js");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v2/notes", notesRoutes2);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api/v2/notes`));