require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { setIO, onlineUsers } = require("./lib/socketStore");


const connectDB = require("./utils/dbConnection");

// ROUTES
const authRoute = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const daycareRoute = require("./routes/daycareRoute");
const chatRoute = require("./routes/chatRoute");
const paymentRoute = require("./routes/paymentRoute");


const port = process.env.PORT || 5000;

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cookieParser());
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({ extended: true, limit: "100mb"}));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =========================
   BASIC ROUTE
========================= */
app.get("/", (req, res) => {
  res.send(`Testing express server on port ${port}`);
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/daycare", daycareRoute);
app.use("/api/chat", chatRoute);
app.use("/api/payments", paymentRoute);


/* =========================
   HTTP SERVER + SOCKET.IO
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

setIO(io);

/* =========================
   SOCKET EVENTS
========================= */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins chat system
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
   
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  
  socket.on("message_received_ack", ({ messageId, senderId }) => {
    const senderSocketId = onlineUsers.get(senderId);
  
    if (senderSocketId) {
      io.to(senderSocketId).emit("message_delivered", {
        messageId,
      });
    }
  });


  socket.on("message_viewed", async ({ messageId, senderId }) => {
    const senderSocketId = onlineUsers.get(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("message_viewed", { messageId });
    }
  });

  // Typing indicator (optional but real-world standard)
  socket.on("typing", ({ receiverId }) => {
    const socketId = onlineUsers.get(receiverId);

    if (socketId) {
      io.to(socketId).emit("typing");
    }
  });

  // Stop typing
  socket.on("stopTyping", ({ receiverId }) => {
    const socketId = onlineUsers.get(receiverId);

    if (socketId) {
      io.to(socketId).emit("stopTyping");
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* =========================
   SERVER START
========================= */
const runServer = async () => {
  try {
    await connectDB();

    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Database connection error:", error.message);
    process.exit(1);
  }
};

runServer();


module.exports = {
  io,
  onlineUsers,
};