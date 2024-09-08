const mongoose = require('mongoose')

module.exports = Token = mongoose.model('Token', new mongoose.Schema({
    email : {
        type : String,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        trim : true
    },
    otp : {
        type : Number,
        expires : 360
    }
},{timestamps : true}))