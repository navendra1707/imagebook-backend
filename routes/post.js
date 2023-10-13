import express from 'express';
import singleUpload from '../middlewares/multer.js';
import { createPost, deletePost, getUserPosts, increaseView } from '../controllers/post.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-post', verifyToken, singleUpload, createPost);
router.get('/get-user-posts/:id', getUserPosts);
router.post('/increase-view/:id', verifyToken, increaseView);

router.delete('/delete-post/:postId', deletePost);

export default router;