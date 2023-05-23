import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({ // Check required on the client
    id: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    name: { type: String },
    phoneNumber: { type: String, unique: true }, // Only number
});

userSchema.pre('save', async function () { // Before save, password encryption
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model("User", userSchema);
export default User;