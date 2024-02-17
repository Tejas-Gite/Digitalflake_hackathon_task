const mongoose = require('mongoose');

const Schemas = new mongoose.Schema({
    id:{type:String, required:true},
    category_id:{type:String, required:true},
    name: {type:String, required:true},
    pack_size: {type:String, required:true},
    mrp: {type:String, required:true},
    image: {type:String, required:true},
    isActive: {type:Number, required:true},
    count:{type:Number, required:true},
    created_at:{type:Date, required:true},
    updated_at:{type:Date},
},{versionKey:false});

const Models = new mongoose.model('products', Schemas);
module.exports = Models; 