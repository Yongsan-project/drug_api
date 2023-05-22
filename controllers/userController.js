import User from "../models/User.js";
import bcrypt from "bcrypt";

export const postJoin = async (req, res) => {
    const { id, email, password, name, confirmPassword, phoneNumber } = req.body; // get data

    // password is not match
    if (password != confirmPassword) return res.send("Password confirmation does not match.");

    // find user-id and email in db
    const userIdExists = await User.exists({ id });
    const emailExists = await User.exists({ email });

    if (userIdExists || emailExists) return res.send("name or email is already taken.");

    // create User data
    await User.create({
        id, email, name, password, phoneNumber
    });

    // joins succees
    return res.send("success join");
}

export const postLogin = async (req, res) => {
    const { id, password } = req.body; // get data
    const user = await User.findOne({ id }); // find user-data in db
    if (!user) return res.send("An account with this id does not exists"); // no user at db

    const confirm = await bcrypt.compare(password, user.password); // confirm password
    if (!confirm) return res.send("Wrong password"); // not match password

    return res.send("success login");
}