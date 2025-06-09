const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Setup
const allowedOrigins = [
  'https://6847167809c2e339f908abe2--teal-mandazi-cd6743.netlify.app', // Netlify Preview
  'https://teal-mandazi-cd6743.netlify.app' // Netlify Production
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

// MongoDB Connection
main()
  .then(() => console.log("Database Connection established"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Chat Application!",
    frontend_url: process.env.FRONTEND_URL,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// Invalid Route Handler
app.all("*", (req, res) => {
  res.json({ error: "Invalid Route" });
});

// Error Handling
app.use((err, req, res, next) => {
  const errorMessage = err.message || "Something Went Wrong!";
  res.status(500).json({ message: errorMessage });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
});

// ✅ Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  pingTimeout: 60000,
  transports: ["websocket"],
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io:", socket.id);

  // Setup
  const setupHandler = (userId) => {
    if (!socket.hasJoined) {
      socket.join(userId);
      socket.hasJoined = true;
      console.log("User joined:", userId);
      socket.emit("connected");
    }
  };

  // New message
  const newMessageHandler = (newMessageReceived) => {
    const chat = newMessageReceived?.chat;
    chat?.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  };

  // Join chat room
  const joinChatHandler = (room) => {
    if (socket.currentRoom && socket.currentRoom !== room) {
      socket.leave(socket.currentRoom);
      console.log(`User left Room: ${socket.currentRoom}`);
    }
    socket.join(room);
    socket.currentRoom = room;
    console.log("User joined Room:", room);
  };

  const typingHandler = (room) => {
    socket.in(room).emit("typing");
  };

  const stopTypingHandler = (room) => {
    socket.in(room).emit("stop typing");
  };

  const clearChatHandler = (chatId) => {
    socket.in(chatId).emit("clear chat", chatId);
  };

  const deleteChatHandler = (chat, authUserId) => {
    chat.users.forEach((user) => {
      if (authUserId === user._id) return;
      socket.in(user._id).emit("delete chat", chat._id);
    });
  };

  const chatCreateChatHandler = (chat, authUserId) => {
    chat.users.forEach((user) => {
      if (authUserId === user._id) return;
      socket.in(user._id).emit("chat created", chat);
    });
  };

  // Register socket events
  socket.on("setup", setupHandler);
  socket.on("new message", newMessageHandler);
  socket.on("join chat", joinChatHandler);
  socket.on("typing", typingHandler);
  socket.on("stop typing", stopTypingHandler);
  socket.on("clear chat", clearChatHandler);
  socket.on("delete chat", deleteChatHandler);
  socket.on("chat created", chatCreateChatHandler);

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.removeAllListeners();
  });
});
