export const protectorMiddleware = (req, res, next) => {
    if (req.session) next();
    else return res.status(402).json("Not allowed");
}

export const UnknownUserMiddleware = (req, res, next) => {
    if (req.session) return res.status(402).json("Not allowed");
    next();
}