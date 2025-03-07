const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// 📌 Middleware
app.use(cors());
app.use(express.json());

// 📌 API Routes
app.use("/api", routes);

// 📌 Server frontend fra `dist/` (i produktion)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 📌 Sørg for, at API-routes ikke bliver overskrevet af frontend-routing
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API-route ikke fundet!" });
});

// 📌 Server alle andre ruter fra frontendens `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 📌 Start serveren
app.listen(PORT, () => console.log(`🚀 Server kører på http://localhost:${PORT}`));
