import express from "express"
import { logout, postJoin, postLogin, sendSMS, getHome, getLogin, getJoin, getSMS } from "../controllers/userController.js";
import { protectorMiddleware, UnknownUserMiddleware } from "../middlewares/middleware.js";

const userRouter = express.Router();

userRouter.route("/home").all(protectorMiddleware).get(getHome);
userRouter.route("/join").all(UnknownUserMiddleware).get(getJoin).post(postJoin); // http://localhost:3000/join
userRouter.route("/login").all(UnknownUserMiddleware).get(getLogin).post(postLogin); // http://localhost:3000/login
userRouter.route("/send").all(protectorMiddleware).get(getSMS).post(sendSMS); // http://localhost:3000/send
userRouter.route("/logout").all(protectorMiddleware).get(logout);

export default userRouter;