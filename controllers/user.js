const User = require('../models/user')
const Product = require('../models/products')
const Cart = require('../models/cart')
const Order = require('../models/order')
const nodemailer = require('nodemailer')

exports.userCart = async (req, res) => {
  const { cart } = req.body

  let products = []

  const user = await User.findOne({ email: req.user.email }).exec()

  let cartExistByThisUser = await Cart.findOne({ orderBy: user._id }).exec()
  if (cartExistByThisUser) {
    cartExistByThisUser.remove()
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {}

    object.product = cart[i]._id
    object.count = cart[i].count
    let productFromDb = await Product.findById(cart[i]).select('price').exec()
    object.price = productFromDb.price
    products.push(object)
  }
  let cartTotal = 0
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderBy: user._id,
  }).save()
  res.json({ ok: true })
}

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()
  let cart = await Cart.findOne({ orderBy: user._id })
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec()

  const { products, cartTotal, totalAfterDiscount } = cart
  res.json({ products, cartTotal, totalAfterDiscount })
}

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  const cart = await Cart.findOneAndRemove({ orderBy: user._id }).exec()
  res.json(cart)
}

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec()
  const cart = await Cart.findOneAndUpdate(
    { orderBy: userAddress._id },
    { address: req.body.address },
    { new: true }
  )
  // console.log(req.body)
  res.json({ ok: true })
}

exports.createOrder = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()
  if (user.isBlocked == true) {
    res.status(400).json('User Restricted')
  }
  let { products, cartTotal, address } = await Cart.findOne({
    orderBy: user._id,
  }).exec()
  if (
    !products ||
    products == 'undefined' ||
    !cartTotal ||
    cartTotal == 'undefined' ||
    !address ||
    address == 'undefined'
  ) {
    res.status(400).json('Cannot Process Order Now')
  }
  let newOrder = await new Order({
    products,
    orderBy: user._id,
    totalOrderAmount: cartTotal,
    address: address,
  }).save()

  let bulkoptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: {
          $inc: { quantity: -item.count, sold: +item.count },
        },
      },
    }
  })
  let updated = await Product.bulkWrite(bulkoptions, {})
  // console.log('PRODUCT QUANTITY', updated)

  // console.log('NEW ORDER SAVED')
  res.json({ ok: true })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: req.user.email,
    subject: 'Mercury Mega Mart - Order Placed',
    html: `<p>Hi, New Order has been received from your account <b>${req.user.email}</b> 
      with total amount of <b>${cartTotal} INR</b> as Cash On Delivery Order<br/>
      refernce order id : <b>${newOrder._id}</b> <br/>
      If you are not sure about this order       please Call Us immediately at 1234567890
    </p>`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
  })

  var mailOptions2 = {
    from: process.env.NODEMAILER_EMAIL,
    to: process.env.NODEMAILER_EMAIL,
    subject: 'Mercury Mega Mart - New Order Received',
    html: `<p>Hi, New Order has been received from the account <b>${req.user.email}</b> 
      with total amount of <b>${cartTotal} INR</b> as Cash On Delivery Order<br/>
      refernce order id : <b>${newOrder._id}</b> <br/>
      
    </p>`,
  }

  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.log(error)
    }
  })
}

exports.getOrders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec()
  let userOrders = await Order.find({ orderBy: user._id })
    .populate('products.product')
    .exec()
  res.json(userOrders)
}

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec()
  res.json({ ok: true })
}

exports.getwishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .exec()

  res.json(list)
}

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec()
  res.json({ ok: true })
}

exports.getAllusers = async (req, res) => {
  try {
    const adminUser = await User.findOne({ email: req.user.email })

    const allUsers = await User.find({ _id: { $ne: adminUser._id } })
    res.json(allUsers)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.blockStatus = async (req, res) => {
  try {
    const { id, isBlocked } = req.body

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: !isBlocked,
      },
      { new: true }
    )
    res.json({ ok: true })
  } catch (error) {
    res.status(400).json(error)
    console.log(error)
  }
}
