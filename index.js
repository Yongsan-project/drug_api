import "dotenv/config.js"
import "./db.js"
import express from "express";
import helmet from "helmet"
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouter.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT; // port

const logger = morgan("dev");

// // cors
app.use(cors({
    origin: 'https://www.yongsandrug.co.kr',
    credentials: true
}));


app.use(helmet()); // Use security header module
app.use(cookieParser());
app.use(bodyParser.json()); // For get params in the request data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
//     cookie: {
//         httpOnly: false,
//         maxAge: 86400000
//     }
// }));
app.use(logger);
app.on("error", (err) => console.log(`Server error : ${err.message}`));

app.use("/", userRouter); // Use userRouter

app.listen(PORT, () => { // Server open
    console.log(`server is listening at http://localhost:${PORT} 🚀`);
})

export default app;
