import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// for creating posts (create)
export const createPost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const user = await User.findById(userId);
    
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      title: title,
      description: description,
      userPicturePath: user.picturePath,
      picturePath: req.file.path, 
      likes: {},
      comments: [],
    });
    
    await newPost.save();
    
    // Return the newly created post instead of all posts
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// getting feed posts (read)
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// getting user posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// updating posts (update)
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    
    // if the user has already liked the post, delete the like
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// for updating a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// for deleting a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};