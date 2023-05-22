import mongoose from "mongoose";

// DB connect
mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("DB error", err);
})