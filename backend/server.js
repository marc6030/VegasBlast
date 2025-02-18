const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 📌 Server frontend fra `dist/` (i produktion)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Route Test
app.get("/api/test", (req, res) => {
  res.json({ message: "API fungerer!" });
});

// 📌 Server alle andre ruter fra frontendens `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// WebSocket opsætning
io.on("connection", (socket) => {
  console.log("En bruger er forbundet!");

  socket.on("place_bet", (bet) => {
    console.log(`Bruger placerede et bet: ${bet}`);

    // Simulerer et roulette-spin (random number fra 0-36)
    const result = Math.floor(Math.random() * 37);

    // Sender resultatet til alle spillere
    io.emit("spin_result", result);
  });

  socket.on("disconnect", () => {
    console.log("En bruger har forladt spillet.");
  });
});

// Start serveren
server.listen(PORT, () => console.log(`🚀 Server kører på http://localhost:${PORT}`));
