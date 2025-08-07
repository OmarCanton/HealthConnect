require('dotenv').config()
const express = require('express')
const connectToDB = require('./config/connectDB')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')

//initialize app using express
const app = express()

//connect to database
connectToDB()

//prevent cors issues
app.use(cors({
    origin: process.env.FRONT_END_URL,
    methods: '*',
    credentials: true
}))

//parse express body
app.use(express.json())
app.use(cookieParser())


app.use('/server/auth', authRoutes)

//connect and listen to the server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App server running on port ${PORT}`)
})