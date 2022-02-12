const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const { orders, orderStatus } = require('../controllers/admin')

router.get('/getOrderAdmin', authCheck, adminCheck, orders)
router.put('/orderStatus', authCheck, adminCheck, orderStatus)

module.exports = router
