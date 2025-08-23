require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const header = req.headers.Authorization || req.headers.authorization
    if(!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Invalid token format' })
    const token = header.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(401).json({ message: 'Session expired, please login'})
        req.user = user
        next()
    })
     
}

const verifyRole = (roles) => (req, res, next) => {
    const user = req.user
    if(!roles.includes(user?.role)) return res.status(401).json({ message: 'Access Denied!'}) 
    next()
}

module.exports = {
    verifyToken, 
    verifyRole
}