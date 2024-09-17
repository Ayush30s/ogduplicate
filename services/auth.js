const JWT = require("jsonwebtoken");

const secretKey = "BKLwtfsffewqkxvmcxc";

const createToken = (user) => {
    const { email, password, fullname, gender, profileImage, usertype } = user;

    const userPayload = {
        _id: user._id,
        email: email,
        password: password ,
        name: fullname,
        gender: gender,
        profileImage: profileImage,
        usertype: usertype
    };

    const token = JWT.sign(userPayload, secretKey);
    return token;
}

const verifytoken = (token) => {
    const userPayload = JWT.verify(token, secretKey);
    return userPayload;
}

module.exports = {
    createToken,
    verifytoken
}