const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Database connection successful')
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB
