const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Ai-Model')
        console.log('database connection successful')
    } catch (error) {
        console.log(error)
        setTimeout(() =>{
            connectDB()
        },2000)
    }
}

module.exports = connectDB