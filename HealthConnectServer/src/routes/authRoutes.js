const  { Router } = require('express')
const { register, login, verifyOTP } = require('../controllers/auth_controller')
const upload = require('../config/multerConfig')
const MulterErrorHandler = require('../utils/multerErrorHandler')

const router = Router()


router.post('/register', upload.single('profileImage'), MulterErrorHandler, register)
router.post('/verify/:id', verifyOTP)
router.post('/login', login)

module.exports = router