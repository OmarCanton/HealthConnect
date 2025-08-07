const  { Router } = require('express')
const { register, login, verifyOTP } = require('../controllers/auth_controller')

const router = Router()


router.post('/register', register)
router.post('/verify/:id', verifyOTP)
router.post('/login', login)

module.exports = router