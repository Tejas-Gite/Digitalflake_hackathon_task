const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const user_model = require('../models/user_model');
const decryptPass = require('../middleware/crypto');

router.post('/add', (req, resp) => {

    try {
        user_model.find({ "$or": [{ email: { $regex: '^' + (req.body.email).trim() + '$', $options: 'i' } }, { mobile: req.body.mobile }] }).count()
            .then((data_count) => {
                if (data_count == 0) {
                    user_model.aggregate([{
                        $group:
                        {
                            _id: "null",
                            maxCount: { $max: "$count" }
                        }
                    }]).then(async (all_data_count) => {
                        let id = "U10000";
                        let c;
                        if (all_data_count.length > 0) {
                            id = id + (all_data_count[0].maxCount + 1);
                            c = all_data_count[0].maxCount + 1;
                        }
                        if (all_data_count.length == 0) {
                            id = id + 1;
                            c = 1;
                        }
                        let crypto_password_decrp = await decryptPass.decryptPasswrod(req.body.password);
                        let bcrypt_password = await bcrypt.hash(crypto_password_decrp, 10);
                        user_model({ id: id, first_name: req.body.first_name, last_name: req.body.last_name, email: (req.body.email).toLowerCase(), mobile: req.body.mobile, password: bcrypt_password, password_string: crypto_password_decrp, count: c, created_at: new Date() }).save().then((data_save) => {
                            resp.json({ status: true, message: "Record Added", data: data_save });
                        });
                    });
                }
                else {
                    resp.json({ status: false, message: "Record Already Exists" });
                }
            })
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }
});

module.exports = router;