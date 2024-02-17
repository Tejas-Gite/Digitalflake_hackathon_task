const mongoose = require('mongoose');

const Schemas = new mongoose.Schema({
    token:{type:String, require:true},
    used_status:{type:Boolean, require:true},
    created_at:{type:Date, required:true},
    updated_at:{type:Date},
},{versionKey:false});

const Models = new mongoose.model('use_token', Schemas);
module.exports = Models; 