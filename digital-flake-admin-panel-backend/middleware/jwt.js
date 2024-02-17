const jwt = require('jsonwebtoken');
module.exports.createjwttoken = function (data) {
    const emailID = data[0].email;
    const name = data[0].first_name +" "+ data[0].last_name;
    const id = data[0].id;
    const user = { id:id, name: name, email: emailID}
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    return accesstoken;
}
module.exports.authenticateToken = function (req, resp, next) {
    const token = req.headers.token;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return resp.json({ "status": "403" });
        next();
    });
}

module.exports.createjwttoken_forgot_password = function (data) {
    const emailID = data[0].email;
    const name = data[0].first_name + data[0].last_name;
    const id = data[0].id;
    const user = { id:id, name: name, email: emailID}
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
    return accesstoken;
}