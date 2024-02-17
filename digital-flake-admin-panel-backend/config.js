const mongoose = require('mongoose');

function connection()
{
    mongoose.connect(process.env.DATABASE);
    console.log("Connection Successful");   
}
module.exports = connection();