import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

const userCtrl = new userController();

router.post('/api/users', userCtrl.register);

export default router;