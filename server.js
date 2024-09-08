const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


require('dotenv').config()
const app = express()


app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://43.204.140.29"
      ],
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

// database connection
const connectDB = require('./config/mongodb.config')
connectDB()

const PORT = process.env.PORT || 8080
const indexRoute = require('./routes/index.route')


app.use(indexRoute)


app.get('/',(req,res) => {
    res.json({
        message : "Welcome to OWW Dashboard Application System!"
    })
})


app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})

