import express from "express";
import upload from "../utils/multer.js";
import userController from "../controllers/userController.js";
import imageController from "../controllers/imageController.js";
import authOptional from "../middleware/authOptional.js";

const router = express.Router();

const userCtrl = new userController();
const imageCtrl = new imageController();

router.post('/api/upload', upload.single('image'), authOptional, imageCtrl.upload);
// router.get('/api/download/:fileId', imageCtrl.download);

router.post('/api/users/register', userCtrl.register);
router.post('/api/users/login', userCtrl.login);

export default router;