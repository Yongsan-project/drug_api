import User from "../models/User.js";
import Counter from "../models/Counter.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const getHome = async (req, res) => {
    const { userData: { user: { id } } } = req;
    const user = await User.findOne({ _id: id });

    if (user) return res.status(200).json({ "msg": "Already Logged In", "user": user.id });
    return res.status(401).json({ "msg": "Not Allowed", });
}

export const getLogin = async (req, res) => {
    const { userData: { user: { id } } } = req;
    const user = await User.findOne({ _id: id });

    if (user) return res.status(401).json({ "msg": "Already Logged In", "user": user.id });
    return res.status(200).json({ "msg": "Allowed" });
}

export const getJoin = async (req, res) => {
    const { userData: { user: { id } } } = req;
    const user = await User.findOne({ _id: id });

    if (user) return res.status(401).json({ "msg": "Already Logged In", "user": user.id });
    return res.status(200).json({ "msg": "Allowed" });
}

export const postJoin = async (req, res) => {
    try {
        const { id, password, confirmPassword, } = req.body; // get data

        // password is not match
        if (password !== confirmPassword) return res.status(401).json("Password confirmation does not match.");

        // invalid value
        if (!(id && password)) return res.status(401).json("Invalid value");

        // find user-id and email in db
        const userIdExists = await User.exists({ id });

        if (userIdExists) return res.status(401).json("user id is already taken.")


        // create User data
        await User.create({
            id, password
        });

        // joins succees
        return res.status(200).json("Join Success");
    } catch (e) {
        return res.status(500).json(`Server Error : ${e}`);
    }
}

export const postLogin = async (req, res) => {
    try {
        let isAdmin = false;
        const { id, password } = req.body; // get data
        const user = await User.findOne({ id }); // find user-data in db
        if (!user) return res.status(401).json("An account with this id does not exists"); // no user at db

        const confirm = await bcrypt.compare(password, user.password); // confirm password
        if (!confirm) return res.status(401).json("Wrong password"); // not match password

        if (id === "yongsandrug") isAdmin = true;

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(payload, process.env.COOKIE_SECRET, { expiresIn: "3h" }, (err, token) => {
            if (err) throw err;
            res.status(200).send({ token, isAdmin, userId: id });
        })

    } catch (e) {
        return res.status(500).json(`Server Error : ${e}`);
    }
}

export const getSMS = async (req, res) => {
    const id = req.query.id;
    let isAdmin = false;
    let total = 0, today = 0;

    Counter.findOne({ name: "visitors" }).then((counter) => {
        if(!counter) return res.status(500).json({"msg" : "getSMS ERROR"});
        
        total = counter.totalCount;
        today = counter.todayCount;
    }).catch((err) => res.status(500).json({"msg" : "getSMS ERROR"}))

    if (id === "yongsandrug") isAdmin = true;
    res.status(200).json({ "msg": "Access", "isAdmin": isAdmin, "totalCount": total, "todayCount": today });
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
            "content": "머리가 좋아지는 약 판매합니다! https://www.yongsandrug.co.kr/",
            "messages": [{ "to": `${phoneNumber}` }],
        }
    })


    return res.status(200).json(response_sms.data);
}

export const logout = (req, res) => {
    res.clearCookie('access_jwt', {
        domain: 'localhost',
        path: '/',
        sameSite: 'none',
        httpOnly: true,
        secure: true,
    })
    return res.status(200).json("Logout Success");
}
