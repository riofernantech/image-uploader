import jwt from 'jsonwebtoken';
import { prismaClient } from "../config/database.js";
const JWT_SECRET = process.env.JWT_SECRET;

const authOptional = async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await prismaClient.user.findFirst({
                where: { email: decoded.email },
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            });
        } else {
            req.user = null;
        }
    } catch {
        req.user = null;
    }
    next();
};

export default authOptional;
