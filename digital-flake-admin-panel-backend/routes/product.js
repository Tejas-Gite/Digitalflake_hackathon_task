const multer = require('./multer');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const product_model = require('../models/product_model');

router.post('/add', multer.single('image'), (req, resp) => {

    try {
        product_model.aggregate([{
            $group:
            {
                _id: "null",
                maxCount: { $max: "$count" }
            }
        }]).then((all_data_count) => {
            let id = "PD10000";
            let c;
            if (all_data_count.length > 0) {
                id = id + (all_data_count[0].maxCount + 1);
                c = all_data_count[0].maxCount + 1;
            }
            if (all_data_count.length == 0) {
                id = id + 1;
                c = 1;
            }
            let image = "";
            if (req.file) {
                image = req.file.filename;
            }
            product_model({ id: id, category_id: req.body.category_id, name: req.body.name, pack_size: req.body.pack_size, mrp: req.body.mrp, image: image, isActive: req.body.isActive, count: c, created_at: new Date() }).save().then((data_save) => {
                resp.json({ status: true, message: "Record Added", data: data_save });
            });
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }


});

router.put('/update', multer.single('image'), (req, resp) => {

    try {
        
        if (req.file != undefined) {
            product_model.findOne({ id: req.body.id }, { image: 1 })
                .then(async (image_name) => {
                    if (image_name.image != "" && image_name.image != undefined) {
                        await deleteFile(image_name.image)
                    }
                    await product_model.updateOne({ id: req.body.id }, { $set: { image: req.file.filename } })

                });
        }
        product_model.updateOne({ id: (req.body.id).trim() }, { $set: { category_id: req.body.category_id, name: req.body.name, pack_size: req.body.pack_size, mrp: req.body.mrp, isActive: req.body.isActive, update_at: new Date() } }).then((update_data) => {
            resp.json({ status: true, message: "Record Updated", data: update_data });
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }
});


router.get('/findById/:id', (req, resp) => {
    try {
        product_model.findOne({ id: req.params.id }).then((find_data) => {
            resp.json({ status: true, data: find_data });
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }

});

router.delete('/delete/:id', (req, resp) => {
    try {
        product_model.findOne({ id: req.params.id }).then(async (foundData) => {
            
            if (foundData.image != "") {
                await deleteFile(foundData.image);
            }
            product_model.deleteOne({ id: req.params.id }).then((find_data) => {
                resp.json({ status: true, message: "Record Deleted", data: find_data });
            });
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }


});

router.get('/list', async function (req, resp) {

    try {
        var sort = {};
        sort[req.query.sort_field] = Number(req.query.sort_type);
        let sort1 = {};
        sort1["created_at"] = -1;

        let data = await product_model.aggregate(
            [

                {
                    $match: {
                        "$or":
                            [
                                { id: { $regex: ".*" + String(req.query.name).trim() + ".*", $options: 'i' } },
                                { name: { $regex: ".*" + String(req.query.name).trim() + ".*", $options: 'i' } },
                            ]
                    }
                },
                { $sort: sort1 },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: 'id',
                        as: 'category_details'
                    }
                },
                {
                    $project: {
                        id: 1,
                        'category_details.name': 1,
                        name: 1,
                        pack_size: 1,
                        mrp: 1,
                        image: 1,
                        isActive: 1
                    }
                },
                {
                    $facet:
                    {
                        metadata: [{ $count: "total" }, { $addFields: { page: Number(req.query.page) } }, { $addFields: { limit: Number(req.query.limit || 3) } }],
                        data: [{ $skip: Number(req.query.page - 1) * Number(req.query.limit || 3) }, { $limit: Number(req.query.limit || 3) }, { $sort: sort }]
                    }
                }
            ]);
        resp.json({ status: true, data: data });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }


});


function deleteFile(filename) {
    try
    {
        fs.unlink(process.cwd() + '/uploads/' + filename, function (err) {
            if (err) console.log(err);
            return true;
        });
    }
    catch (error) {
        console.log(error);
        resp.json({ status: false, message: "Server Error Please Try Again", error: error });
    }
    
}

module.exports = router;