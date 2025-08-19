import express from "express";
import "dotenv/config";
import cors from "cors";
import { dbConnect } from "./db/db.js";
import { errorHandler, socketAuthentication } from "./utils/helper.js";
const PORT = process.env.PORT || 3000;
const app = express();
import { Server as SocketServer } from "socket.io";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import Message from "./models/Message.js";

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, 
  })
);

// db connection
dbConnect();

const socketsMap = new Map();
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});
io.use(socketAuthentication);
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  const userId = socket.userId;
  socketsMap.set(userId, socket.id);

  socket.on("chat-message", async (data) => {
    const { message, receiver } = data;
    console.log(data)
    const newMessage = await Message.create({
      message: message,
      sender: socket.userId,
      receiver: receiver,
    });

    const receiverSocket = socketsMap.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("chat-message", newMessage);
    }

    socket.emit("chat-message", newMessage);
  });

  // user join handled by middleware
  //   socket.on("user-join", () => {});

  socket.on("disconnect", () => {
    if (socket.userId) {
      socketsMap.delete(socket.userId);
    }
  });
});

app.use("/user", userRoutes);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
