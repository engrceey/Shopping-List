const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/DB')
const shoppingRoutes = require('./routes/shoppingList')
mongoose.Promise = global.Promise;

dotenv.config({path: './config/config.env'})
connectDB()

const app = express()

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())


if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use('/', shoppingRoutes )

const PORT = process.env.PORT || 5005
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )