import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(400).json({ "msg": "Not Allowed User" });
    }

    try {
        const decode = jwt.verify(token, process.env.COOKIE_SECRET);
        req.userData = decode;
        next();
    } catch (err) {
        return res.status(401).json({ "msg": "Token is not valid" });
    }
}
