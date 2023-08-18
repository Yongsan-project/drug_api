import User from "../models/User.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import axios from "axios";

export const getHome = async (req, res) => {
    const {
        session: {
            user: { id }
        }
    } = req;

    const user = await User.findOne({ id });

    return res.status(200).json({ "msg": "Allowed user", "user": user.id });
}

export const getLogin = async (req, res) => {
    return res.status(200).json({ "msg": "Allowed user" });
}
export const getJoin = async (req, res) => {
    return res.status(200).json({ "msg": "Allowed user" });
}

export const postJoin = async (req, res) => {
    try {
        const { id, email, password, name, confirmPassword, phoneNumber } = req.body; // get data

        // password is not match
        if (password !== confirmPassword) return res.status(401).json("Password confirmation does not match.");

        // invalid value
        if (!(id && email && password && name && phoneNumber)) return res.status(401).json("Invalid value");

        // find user-id and email in db
        const userIdExists = await User.exists({ id });
        const emailExists = await User.exists({ email });
        const phoneNumberExists = await User.exists({ phoneNumber });

        if (userIdExists) return res.status(401).json("user id is already taken.")
        if (emailExists) return res.status(401).json("email is already taken.")
        if (phoneNumberExists) return res.status(401).json("phone number is already taken.")


        // create User data
        await User.create({
            id, email, name, password, phoneNumber
        });

        // joins succees
        return res.status(200).json("Join Success");
    } catch (e) {
        return res.status(500).json(`Server Error : ${e}`);
    }
}

export const postLogin = async (req, res) => {
    try {
        const { id, password } = req.body; // get data
        const user = await User.findOne({ id }); // find user-data in db
        if (!user) return res.status(401).json("An account with this id does not exists"); // no user at db

        const confirm = await bcrypt.compare(password, user.password); // confirm password
        if (!confirm) return res.status(401).json("Wrong password"); // not match password

        req.session.user = user;
        req.session.loggedIn = true;

        req.session.save(() => {
            res.status(200).json({ "msg": "Login Success", "userId": id });
        })
    } catch (e) {
        return res.status(500).json(`Server Error : ${e}`);
    }
}

export const sendSMS = async (req, res) => {
    const {
        phoneNumber
    } = req.body;
    const date = Date.now().toString(); // date(String)
    console.log(req.body);

    // environment variable
    const service_id = process.env.NCP_SERVICE_ID;
    const access_key = process.env.NCP_API_ACCESS_KEY;
    const secret_key = process.env.NCP_API_SECRET;
    const call_number = process.env.CALL_NUMBER;

    // request variable
    const space = " ";
    const nl = "\n";
    const req_url = `https://sens.apigw.ntruss.com/sms/v2/services/${service_id}/messages`;
    const signature_url = `/sms/v2/services/${service_id}/messages`;
    const method = "POST";

    // signature
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secret_key);
    hmac.update(method); // method
    hmac.update(space);
    hmac.update(signature_url); // url
    hmac.update(nl);
    hmac.update(date); // date
    hmac.update(nl);
    hmac.update(access_key);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    // send request to SENS server
    const response_sms = await axios({
        method: method,
        url: req_url,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": access_key,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: {
            "type": "SMS",
            "countryCode": "82",
            "from": call_number,
            "content": "success send sms",
            "messages": [{ "to": `${phoneNumber}` }],
        }
    })


    return res.status(200).json(response_sms.data);
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.status(200).json("Logout Success");
}