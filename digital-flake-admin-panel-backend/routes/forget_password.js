
const express = require('express');
const router = express.Router();
const user_model = require('../models/user_model');
const jwt = require('../middleware/jwt');
const mail = require('../middleware/mail');
const use_token_model = require('../models/use_token');
const bcrypt = require('bcryptjs');
const decryptPass = require('../middleware/crypto');


router.post('/password_restore/:email', (req, resp) => {
    try {
        user_model.find({ email: (req.params.email).trim() }).then((found_users) => {
            if (found_users.length == 0) {
                resp.json({ status: false, message: "Email not registered" });
            }
            else {
                if (found_users.length == 1) {

                    let token = jwt.createjwttoken_forgot_password(found_users);

                    use_token_model({ token: token, used_status: false, created_at: new Date() }).save().then(() => {
                        mail.method(found_users[0].email, "", "http://localhost:4200/forgot_password/?token=" + token, "Forgot Password").then((sent_mail) => {
                            resp.json({ status: true, message: "URL is shared on registered email id" });
                        })
                    })
                }
                else {
                    resp.json({ status: false, message: "Something went wrong please contact support team" });
                }
            }
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }

});

router.post('/save_password', jwt.authenticateToken, (req, resp) => {
    try {
        use_token_model.countDocuments({ "$and": [{ token: req.headers.token }, { used_status: false }] }).then(async (count) => {
            if (count == 1) {
                let password =  await decryptPass.decryptPasswrod(req.body.password);
                let bcrypt_password = await bcrypt.hash(password, 10);
                user_model.updateOne({ id: req.body.id }, { "$set": { password: bcrypt_password, password_string: password, update_at: new Date() } }).then(() => {
                    use_token_model.updateOne({ token: req.headers.token }, { "$set": { used_status: true } }).then(() => {
                        resp.json({ status: true, message: "Password Updated" });
                    })
                })
            }
            else {
                resp.json({ status: false, message: "Session Expired" })
            }
        })
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }

});

module.exports = router;