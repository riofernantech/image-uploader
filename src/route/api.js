import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

const userCtrl = new userController();

router.post('/api/users/register', userCtrl.register);
router.post('/api/users/login', userCtrl.login);

export default router;