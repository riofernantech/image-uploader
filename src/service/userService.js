import { prismaClient } from "../config/database.js";
import bcrypt from "bcrypt";
import ValidationException from "../exception/validationException.js";
import validate from "../validation/validation.js";
import { loginUserValidation, registerUserValidation } from "../validation/userValidation.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req) => {
    try {
        req = validate(registerUserValidation, req);

        const exists = await prismaClient.user.count({
            where: {
                OR: [
                    { name: req.name },
                    { email: req.email }
                ]
            }
        });

        if (exists > 0) {
            throw new ValidationException("Nama atau Email sudah terdaftar");
        }

        req.password = await bcrypt.hash(req.password, 10);

        const user = await prismaClient.user.create({
            data: req,
            select: {
                email: true,
                name: true
            }
        });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return {
            email: user.email,
            token
        }
    } catch (error) {
        throw error;
    }

}

const login = async (req) => {
    try {
        req = validate(loginUserValidation, req);

        const user = await prismaClient.user.findUnique({
            where: {
                email: req.email
            },
            select: {
                email: true,
                name: true,
                password: true
            }
        });

        if (!user) {
            throw new ValidationException('Email atau password salah', 401);
        }

        const valid = await bcrypt.compare(req.password, user.password);
        if (!valid) {
            throw new ValidationException('Email atau password salah', 401);
        }

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return {
            email: user.email,
            token
        };
    } catch (error) {
        throw error;
    }
}

export {
    register,
    login
}