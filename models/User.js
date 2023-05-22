import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    name: { type: String },
    phoneNumber: { type: String, unique: true },
});

userSchema.pre('save', async function () {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model("User", userSchema);
export default User;