import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalCount: { type: Number, required: true },
    todayCount: { type: Number },
    date: { type: String }
});

const Counter = mongoose.model('counter', counterSchema);
export default Counter;