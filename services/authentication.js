const JWT = require("jsonwebtoken");
const secret = "Rudra@25";

function createUserToken(user){
    const payload ={
        _id:user.id,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
        fullName:user.fullName,
    }
    const token = JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports={
    createUserToken,validateToken
}