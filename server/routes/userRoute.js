import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.post('/register', async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: "User already exists!" });
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        if(user){
            res.status(201).json({ 
                message: "Registered!",
                _id: user._id,
                username: user.username,
                email: user.email,
            })
        }
    } catch(err){
        res.status(400).json({message: err.message})
    }
})

userRouter.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user && (await user.checkPassword(password))){
            res.status(200).json({ 
                message: "Login Successfull!",
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            })
        }
        else{
            res.status(401).json({message: "Incorrect Email or Password!"});
        }
    } catch(err){
        res.status(400).json({message: err.message})
    }
})

// Generate a token after login
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: "30d",})
}

export default userRouter;