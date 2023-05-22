import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("DB error", err);
})