import "dotenv/config.js"
import "./db.js"
import express from "express";
import helmet from "helmet"
import morgan from "morgan";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const PORT = process.env.PORT; // port

const logger = morgan("dev");

app.use(helmet()); // Use security header module
app.use(bodyParser.json()); // For get params in the request data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}));
app.use(logger);
app.use("/", userRouter); // Use userRouter

app.listen(PORT, () => { // Server open
    console.log(`server is listening at http://localhost:${PORT} 🚀`);
})

export default app;