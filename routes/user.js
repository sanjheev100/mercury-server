const express = require('express')
const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  createOrder,
  getOrders,
  addToWishlist,
  getwishlist,
  removeFromWishlist,
  getAllusers,
  blockStatus,
} = require('../controllers/user')

router.post('/user/cart', authCheck, userCart)
router.get('/getCart', authCheck, getUserCart)
router.delete('/removeCart', authCheck, emptyCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/order', authCheck, createOrder)
router.get('/user/getOrder', authCheck, getOrders)

//wishlist
router.post('/user/wishlist', authCheck, addToWishlist)
router.get('/user/getWishlist', authCheck, getwishlist)
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist)

//get all users for admin
router.get('/getAllUsers', authCheck, adminCheck, getAllusers)

//block and unblock
router.put('/changeBlock', authCheck, adminCheck, blockStatus)

module.exports = router
