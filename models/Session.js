import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
const Session = mongoose.model('sessions', SessionSchema, 'sessions');

export default Session;