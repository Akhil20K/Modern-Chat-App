import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import Chat from "../models/chatModel.js";

const chatRouter = express.Router();

chatRouter.post('/', isAuthenticated, async(req, res) => {
    try{
        const { content, groupId } = req.body;
        const chat = await Chat.create({
            sender: req.user._id,
            content: content,
            group: groupId
        });
        const populatedChat = await Chat.findById(chat._id).populate("sender", "username email");
        res.json({populatedChat});
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

export default chatRouter;