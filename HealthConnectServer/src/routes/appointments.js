const { Router } = require('express')
const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointments')
const { verifyToken, verifyRole } = require('../utils/authHelper')

const router = Router()

router.get('/', verifyToken, getAppointments)
router.post('/create', verifyToken, verifyRole(['patient']), createAppointment)
router.patch('/update', verifyToken, verifyRole(['patient']), updateAppointment)
router.delete('/delete', verifyToken, verifyRole(['patient', 'admin']), deleteAppointment)

module.exports = router