const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Name is required',
      trim: true,
      minlength: [2, 'Too Short'],
      maxlength: [32, 'Too Long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SubCategory', subCategorySchema)
