import express from "express";
import Group from "../models/groupModel.js";
import isAuthenticated from "../middlewares/auth.js";
import isAdmin from "../middlewares/admin.js";

const groupRouter = express.Router();

groupRouter.post("/create", isAuthenticated, isAdmin, async (req, res) => {
    try{
        const { name, description } = req.body;
        const group = await Group.create({
            name,
            description,
            admin: req.user._id,
            members: [req.user._id],
        });
        const populateGroup = await Group.findById(group._id).populate(
            'admin',
            "username email"
        ).populate(
            'members',
            "username email"
        )
        res.status(201).json({populateGroup});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
})

groupRouter.get("/list", isAuthenticated, async(req, res) => {
    try{
        const groups = await Group.find().populate("admin", "username email").populate("members", "username email");
        res.json(groups);
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

groupRouter.post("/:groupId/join", isAuthenticated, async(req, res) => {
    try{
        const group = await Group.findById(req.params.groupId);
        if(!group){
            res.status(404).json({message: "Group not found!"});
        }
        if(group.members.includes(req.user._id)){
            res.status(400).json({message: "Already in Group!"})
        }
        group.members.push(req.user._id);
        await group.save();
        res.json({message: "Joined Goup!"});
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

export default groupRouter;