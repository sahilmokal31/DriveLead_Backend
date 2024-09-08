const mongoose = require('mongoose');

const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


module.exports = User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: {
            type: String,
        },
        userId : {
            type : String,
            unique : true
            
        },
        public_id : {
            type : String,
        },
        email: {
            type: String,
            required: true,
            trim : true,
            validate: {
                validator: emailValidator,
                message: 'Invalid email format',
            },
            unique : true,
        },
        password: {
            type: String,
            required: true,
        },
    },{ timestamps: true })
);




