import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import http from "http"; // For Socket.io
import userRouter from './routes/userRoute.js';
import { Server }  from 'socket.io';
import socketio from './socket.js';
import groupRouter from './routes/groupRoute.js';
import chatRouter from './routes/chatRoute.js';

const app = express();
const server = http.createServer(app);
dotenv.config();
const PORT = process.env.PORT;
const io = new Server(server, {
  cors:{
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  }
})

// Middleware
app.use(express.json());
app.use(cors());

// DB
mongoose.connect(process.env.URI).then(() => console.log("DB Connected!")).catch((err) => console.log(err));

socketio(io);

// Routes
app.use('/users', userRouter);
app.use('/groups', groupRouter);
app.use('/chats', chatRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
