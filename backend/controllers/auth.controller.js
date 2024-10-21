import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const Signup = async (req, res) => {
    console.log("Signup function called");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    try {
        const { firstName, lastName, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt();
        const passwordHash = await bcryptjs.hash(password, salt);

        let picturePath = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            picturePath = result.secure_url;
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends: [],
        });

        const savedUser = await newUser.save();
        
        // creating JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
        
        res.status(201).json({ token, user: savedUser });
    } catch (error) {
        console.error("Error in Signup:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// login controller

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "User does not exist. " });

        // comparing passwords
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials. " });
        
        // creating jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ error: error.message });  
    }
}