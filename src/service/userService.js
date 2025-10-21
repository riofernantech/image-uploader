import { prismaClient } from "../config/database.js";
import bcrypt from "bcrypt";
import ValidationException from "../exception/validationException.js";
import validate from "../validation/validation.js";
import { registerUserValidation } from "../validation/userValidation.js";
import jwt from 'jsonwebtoken';

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

        let user = await prismaClient.user.create({
            data: req,
            select: {
                email: true,
                name: true
            }
        });

        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '7d' });

        return {
            user,
            token
        }
    } catch (error) {
        throw error;
    }

}


export {
    register
}