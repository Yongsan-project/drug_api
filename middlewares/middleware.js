import multer from "multer";

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) next();
    else return res.send("Not allowed");
}