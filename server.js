const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// When client connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for message from client
  socket.on("send_message", (data) => {
    console.log("Message received:", data, socket.id);

    // Broadcast message to all connected clients
    socket.emit("receive_message", data);
  });

  // When client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Optional test route
app.get("/", (req, res) => {
  res.send("Socket.IO server is running...");
});

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
