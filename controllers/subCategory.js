const SubCategory = require('../models/subCategory')
const slugify = require('slugify')
const Product = require('../models/products')

exports.createSubCategory = async (req, res) => {
  try {
    const { name, parent } = req.body
    const subcategory = await new SubCategory({
      name,
      slug: slugify(name),
      parent,
    }).save()
    res.status(200).json(subcategory)
  } catch (error) {
    // console.log(error)
    res.status(400).json('Create Sub Category Failed')
  }
}

exports.readSubCategory = async (req, res) => {
  try {
    var subcategory = await SubCategory.findOne({
      slug: req.params.slug,
    })
      .populate('parent')
      .exec()
    const products = await Product.find({ subCategory: subcategory })
    .exec()

    res.status(200).json({
      subCategory: subcategory,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      err: error.message,
    })
  }
}

exports.updateSubCategory = async (req, res) => {
  const { name, parent } = req.body
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        slug: slugify(name),
        parent,
      },
      {
        new: true,
      }
    ).exec()
    if (!updated) {
      res.status(404).json('SubCategory Not Found')
    } else {
      res.status(200).json(updated)
    }
  } catch (error) {
    res.status(400).json('SubCategory Update Failed')
  }
}
exports.removeSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    }).exec()
    if (deleted) {
      res.json(deleted)
    } else {
      res.status(404).json('SubCategory Not Found')
    }
  } catch (error) {
    res.status(400).send('SubCategory Delete Failed')
  }
}

exports.listAllSubCategory = async (req, res) => {
  res.json(
    await SubCategory.find({}).sort({ createdAt: -1 }).populate('parent').exec()
  )
}
