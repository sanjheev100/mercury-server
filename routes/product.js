const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const {
  createProduct,
  readProducts,
  removeProduct,
  getSingleProduct,
  updateProduct,
  getNewArrivals,
  list,
  productsCount,
  productRating,
  listRelated,
  searchFilters,
  updateProductCount,
  getAllProducts,
} = require('../controllers/product')

router.post('/createProduct', authCheck, adminCheck, createProduct)
router.put('/updateProduct/:slug', authCheck, adminCheck, updateProduct)
router.get('/totalproducts/total', productsCount)
router.get('/getProducts', readProducts)
router.get('/getSingleProduct/:slug', getSingleProduct)
router.delete('/product/:slug', authCheck, adminCheck, removeProduct)
router.get('/getNewArrivals', getNewArrivals)
router.post('/products', list)

//updating count
router.put('/updateProductCount', authCheck, adminCheck, updateProductCount)

//rating
router.put('/product/star/:id', authCheck, productRating)
module.exports = router

//realatedProduct
router.get('/product/related/:id', listRelated)

//search

router.post('/search/filters', searchFilters)
