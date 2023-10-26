import jwt from "jsonwebtoken";
import Counter from "../models/Counter.js";

export const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];

    const currentDate = new Date();
    const now = `${currentDate.getFullYear()}/${currentDate.getMonth()}/${currentDate.getDay()}`;
    Counter.findOne({ name: "visitors" }, (err, counter) => {
        if (err) return next();
        if (counter === null) Counter.create({ name: "visitors", totalCount: 1, todayCount: 1, date: now });
        else {
            counter.totalCount++;
            if (counter.date === now) {
                counter.todayCount++;
            } else {
                counter.todayCount = 1;
                counter.date = now;
            }
            counter.save();
        }
    })


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
