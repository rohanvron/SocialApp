import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import { createPost } from "./controllers/post.controller.js";
import { Signup } from "./controllers/auth.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "social_app_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
  },
});


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "picture") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  }
});

// files upload routes
app.post("/auth/signup", upload.single("picture"), Signup);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;