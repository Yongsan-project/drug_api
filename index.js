import "dotenv/config.js"
import "./db.js"
import express from "express";
import helmet from "helmet"
import morgan from "morgan";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";

const app = express();
const PORT = 3000;

const logger = morgan("dev");

app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(logger);
app.use("/", userRouter);

app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT} 🚀`);
})

export default app;