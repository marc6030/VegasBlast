const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const { connectToDatabase } = require("./db");

dotenv.config(); // Load environment variables from .env file
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend from `dist/` (in production)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Route Test
app.get("/api/test", (req, res) => {
  res.json({ message: "API fungerer!" });
});

// Serve all other routes from frontend's `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user has connected!");

  socket.on("place_bet", (bet) => {
    console.log(`User placed a bet: ${bet}`);

    // Simulate a roulette spin (random number from 0-36)
    const result = Math.floor(Math.random() * 37);

    // Emit the result to all players
    io.emit("spin_result", result);
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });
});

// Start the database connection first, then start the Express server
connectToDatabase()
  .then(() => {
    // Start the Express server after the database connection is established
    server.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Error during setup:", err);
  });
