const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const {
  createContactForm,
  allContact,
  removeContactUs,
} = require('../controllers/contactus')

router.post('/postContact', createContactForm)
router.get('/getContacts', authCheck, adminCheck, allContact)
router.delete('/removeContact/:id', authCheck, adminCheck, removeContactUs)
module.exports = router
