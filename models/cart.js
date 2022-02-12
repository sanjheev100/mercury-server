const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartSchema = new mongoose.Schema(
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
    cartTotal: Number,
    orderBy: {
      type: ObjectId,
      ref: 'User',
    },
    address: {
      type: Array,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
