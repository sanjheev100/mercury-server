const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Products',
        },
        count: { type: Number },
        price: { type: Number },
      },
    ],
    orderStatus: {
      type: String,
      default: 'Ordered',
      enum: ['Ordered', 'Processing', 'Dispatched', 'Cancelled', 'Completed'],
    },
    orderBy: { type: ObjectId, ref: 'User' },
    totalOrderAmount: { type: Number },
    address: { type: Array },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Order', orderSchema)
