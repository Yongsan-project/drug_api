import express from "express"
import { postJoin, postLogin, sendSMS } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/join").post(postJoin); // http://localhost:3000/join
userRouter.route("/login").post(postLogin); // http://localhost:3000/login
userRouter.route("/send").post(sendSMS); // http://localhost:3000/send

export default userRouter;