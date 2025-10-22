import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const authOptional = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        req.user = null;
    }

    next();
}

export default authOptional;
