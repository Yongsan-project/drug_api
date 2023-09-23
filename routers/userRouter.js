import express from "express"
import { logout, postJoin, postLogin, sendSMS, getHome, getLogin, getJoin, getSMS } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/middleware.js";

const userRouter = express.Router();

userRouter.route("/home").all(authMiddleware).get(getHome);
userRouter.route("/join").get(authMiddleware, getJoin).post(postJoin); // http://localhost:3000/join
userRouter.route("/login").get(authMiddleware, getLogin).post(postLogin); // http://localhost:3000/login
userRouter.route("/send").all(authMiddleware).get(getSMS).post(sendSMS); // http://localhost:3000/send
userRouter.route("/logout").all(authMiddleware).get(logout);

export default userRouter;