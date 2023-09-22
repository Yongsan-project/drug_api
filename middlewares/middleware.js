export const protectorMiddleware = (req, res, next) => {
    console.log(req.session);
    if (req.session.loggedIn) next();
    else return res.status(402).json("Not allowed");
}

export const UnknownUserMiddleware = (req, res, next) => {
    if (req.session.loggedIn) return res.status(402).json("Not allowed");
    next();
}