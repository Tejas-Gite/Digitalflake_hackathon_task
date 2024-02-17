const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const user_model = require('../models/user_model');
const jwt = require('../middleware/jwt');
const decryptPass = require('../middleware/crypto');
router.post('/login', (req, resp) => {
    try {
        user_model.find({ email: req.body.email }).then(async (found_user) => {
            if (found_user.length == 1) {
                let email = req.body.email;
                let password = await decryptPass.decryptPasswrod(req.body.password);
                let user_password = found_user[0].password;


                if (await bcrypt.compare(password, user_password)) {
                    let token = await jwt.createjwttoken(found_user);
                    resp.json({ status: true, message: "Login success", data: token });
                }
                else {
                    resp.json({ status: false, message: "Invalid Login Credentials" });
                }
            }
            else {
                resp.json({ status: false, message: "Invalid Login Credentials" });
            }
        })
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }
});

module.exports = router;
