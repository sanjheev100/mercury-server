const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Name is required',
      trim: true,
    },
    email: {
      type: String,
      index: true,
    },
    phone: {
      type: Number,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ContactUs', contactSchema)
