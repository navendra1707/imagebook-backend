import express from 'express';
import { login, register } from '../controllers/auth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', singleUpload, register);
router.post('/login', login);

export default router;