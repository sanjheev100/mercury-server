const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const {
  createSubCategory,
  readSubCategory,
  updateSubCategory,
  removeSubCategory,
  listAllSubCategory,
} = require('../controllers/subCategory')

router.post('/createSubCategory', authCheck, adminCheck, createSubCategory)
router.get('/readSubCategory/:slug', readSubCategory)
router.put('/updateSubCategory/:slug', authCheck, adminCheck, updateSubCategory)
router.delete(
  '/removeSubCategory/:slug',
  authCheck,
  adminCheck,
  removeSubCategory
)
router.get('/listAllSubCategory', listAllSubCategory)

module.exports = router
