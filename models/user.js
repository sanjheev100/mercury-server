const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: Array,
      default: [],
    },
    wishlist: [
      {
        type: ObjectId,
        ref: 'Products',
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
