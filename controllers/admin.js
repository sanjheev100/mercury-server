const Order = require('../models/order')
const nodemailer = require('nodemailer')
const User = require('../models/user')

exports.orders = async (req, res) => {
  let orders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product')
    .populate('orderBy')
    .exec()
  res.json(orders)
}

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body

  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec()

  let user = await User.findById(updated.orderBy)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: user.email,
    subject: 'Mercury Mega Mart - Order Status Change',
    html: `<p>Hi, ${user.email}  your order  status changed ,Check the status below and if you have 
         any issue contact us <br/>
      reference order id : <b>${orderId}</b> <br/>
      current status : <b>${orderStatus}</b> <br/>
      If you are not sure about this order please Call Us immediately at 1234567890
    </p>`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
  })

  res.json(updated)
}
