const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const { user, currentUser } = require('../controllers/auth')

router.post('/create-or-update-user', authCheck, user)
router.post('/current-user', authCheck, currentUser)
router.post('/current-admin', authCheck, adminCheck, currentUser)

module.exports = router
