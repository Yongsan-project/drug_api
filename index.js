import "dotenv/config.js"
import "./db.js"
import express from "express";
import helmet from "helmet"
import morgan from "morgan";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";

const app = express();
const PORT = process.env.PORT; // port

const logger = morgan("dev");

// cors
app.use(cors({
    origin: 'https://www.yongsandrug.co.kr/',
    credentials: true
}));
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

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
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
        maxAge: 86400000
    }
}));
app.use(logger);
app.on("error", (err) => console.log(`Server error : ${err.message}`));

app.use("/", userRouter); // Use userRouter

app.listen(PORT, () => { // Server open
    console.log(`server is listening at http://localhost:${PORT} 🚀`);
})

export default app;
