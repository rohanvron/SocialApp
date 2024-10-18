import express from 'express';
import { getFeedPosts, getUserPosts, likePost, createPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// create
router.post('/', verifyToken, createPost);

// read
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

// update
router.patch('/:id/like', verifyToken, likePost);
router.patch('/:id', verifyToken, updatePost);

// delete
router.delete('/:id', verifyToken, deletePost);

export default router;