const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
      maxlength: 45,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      require: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      require: true,
      maxlength: 32,
    },

    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subCategory: [
      {
        type: ObjectId,
        ref: 'SubCategory',
      },
    ],
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    brand: {
      type: String,
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Products', productSchema)
