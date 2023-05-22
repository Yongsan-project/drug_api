import User from "../models/User.js";
import bcrypt from "bcrypt";

export const postJoin = async (req, res) => {
    const { id, email, password, name, confirmPassword, phoneNumber } = req.body;

    if (password != confirmPassword) return res.send("Password confirmation does not match.");

    const userIdExists = await User.exists({ id });
    const emailExists = await User.exists({ email });

    if (userIdExists || emailExists) return res.send("name or email is already taken.");

    await User.create({
        id, email, name, password, phoneNumber
    });

    return res.send("success join");
}

export const postLogin = async (req, res) => {
    const { id, password } = req.body;
    const user = await User.findOne({ id });
    if (!user) return res.send("An account with this id does not exists");

    const confirm = await bcrypt.compare(password, user.password);
    if (!confirm) return res.send("Wrong password");

    return res.send("success login");
}