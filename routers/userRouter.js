import express from "express"
import { logout, postJoin, postLogin, sendSMS } from "../controllers/userController.js";
import { protectorMiddleware } from "../middlewares/middleware.js";

const userRouter = express.Router();

userRouter.route("/join").all(UnknownUserMiddleware).post(postJoin); // http://localhost:3000/join
userRouter.route("/login").all(UnknownUserMiddleware).post(postLogin); // http://localhost:3000/login
userRouter.route("/send").all(protectorMiddleware).post(sendSMS); // http://localhost:3000/send
userRouter.route("/logout").all(protectorMiddleware).get(logout);

export default userRouter;