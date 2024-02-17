const mongoose = require('mongoose');

const Schemas = new mongoose.Schema({
    id:{type:String, required:true},
    first_name: {type:String, required:true},
    last_name: {type:String, required:true},
    email: {type:String, required:true},
    mobile: {type:String, required:true},
    password: {type:String, required:true},
    password_string: {type:String, required:true},
    count:{type:Number, required:true},
    created_at:{type:Date, required:true},
    updated_at:{type:Date},
},{versionKey:false});

const Models = new mongoose.model('admin_users', Schemas);
module.exports = Models; 