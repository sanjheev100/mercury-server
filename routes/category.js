const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const {
  createCategory,
  readCategory,
  updateCategory,
  removeCategory,
  listAllCategory,
  getSubCategory,
} = require('../controllers/category')

router.post('/createCategory', authCheck, adminCheck, createCategory)
router.get('/readCategory/:slug', readCategory)
router.put('/updateCategory/:slug', authCheck, adminCheck, updateCategory)
router.delete('/removeCategory/:slug', authCheck, adminCheck, removeCategory)
router.get('/listAllCategory', listAllCategory)
router.get('/category/subCategory/:_id', getSubCategory)
module.exports = router
