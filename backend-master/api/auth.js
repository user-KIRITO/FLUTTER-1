const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const secretKey = 'aeaRtr88awe';


async function generateHashedPassword({ plainPassword }) {

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(hashedPassword);
    return hashedPassword;
}

async function comparePassword({ plainPassword, hashedPassword }) {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(result);
    return result;
}

async function createToken({email, employeeID, employeeRole }) {

    const payload = {
        email: email,
        employeeID: employeeID,
        employeeRole: employeeRole,
    };
    const payloadString = JSON.stringify(payload);
    const accessToken = jwt.sign(payloadString, secretKey);
    console.log(accessToken);
    return accessToken;

}

async function validateAccessToken({accessToken}) {

    try {

        const result = jwt.verify(accessToken, secretKey);
        console.log(result);
        return result;
    }  
    catch(e) {
        const err = 'Invalid Access Token';
        console.log(err);
        return err;
    }
}

function superadminCheck(req, res, next) {

    const token = req.headers.authorization.split(' ')[1];
    try {
        tokenRes = jwt.verify(token, secretKey);
        if(tokenRes.employeeRole == 'superadmin') {
            next();
        }

        else{
            res.status(401).json({
                error:'Unauthorized'
            });
        }
    }
    catch(e) {
        console.log(e)
        res.status(401).json({
            error:'Invalid Or Missing Token',
        });
    }
}

module.exports = {
    generateHashedPassword,
    createToken,
    comparePassword,
    validateAccessToken,
    superadminCheck
}