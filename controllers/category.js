const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const Product = require('../models/products')
const slugify = require('slugify')

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body
    const category = await new Category({ name, slug: slugify(name) }).save()
    res.status(200).json(category)
  } catch (error) {
    // console.log(error)
    res.status(400).json('Create Category Failed')
  }
}

exports.readCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec()
    // res.status(200).json(category)
    const products = await Product.find({ category })
      .populate('category')
      .populate('subCategory')
      .exec()
    res.json({
      category,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

exports.updateCategory = async (req, res) => {
  const { name } = req.body
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        slug: slugify(name),
      },
      {
        new: true,
      }
    ).exec()
    if (!updated) {
      res.status(404).json('Category Not Found')
    } else {
      res.status(200).json(updated)
    }
  } catch (error) {
    res.status(400).json('Category Update Failed')
  }
}
exports.removeCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    }).exec()
    if (deleted) {
      res.json(deleted)
    } else {
      res.status(404).json('Category Not Found')
    }
  } catch (error) {
    res.status(400).send('Category Delete Failed')
  }
}
exports.listAllCategory = async (req, res) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
}

exports.getSubCategory = async (req, res) => {
  SubCategory.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err)
    res.json(subs)
  })
}
