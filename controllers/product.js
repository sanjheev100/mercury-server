const Product = require('../models/products')
const slugify = require('slugify')
const User = require('../models/user')
const products = require('../models/products')

exports.createProduct = async (req, res) => {
  try {
    // console.log(req.body)
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (err) {
    console.log(err)
    // res.status(400).json('Create Product Failed')
    res.status(400).json({
      err: err.message,
    })
  }
}

exports.readProducts = async (req, res) => {
  let products = await Product.find({})
    .populate('category')
    .populate('subCategory')
    .sort([['createdAt', 'desc']])
    .exec()
  res.json(products)
}

exports.removeProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec()
    res.status(200).json(deleted)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Product Delete Failed')
  }
}

exports.getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subCategory')
    .exec()
  res.status(200).json(product)
}

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec()
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({
      err: error.message,
    })
  }
}

exports.getNewArrivals = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(3)
      .populate('category')
      .populate('subCategory')
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(products)
  } catch (error) {
    res.status(400).json({
      err: error.message,
    })
  }
}

exports.list = async (req, res) => {
  try {
    const { sort, order, page, perPage } = req.body
    const currentPage = page || 1
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subCategory')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()
    return res.status(200).json(products)
  } catch (error) {
    res.status(400).json({
      err: error.message,
    })
  }
}

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec()
  res.json(total)
}

exports.productRating = async (req, res) => {
  const { id } = req.params
  const { star } = req.body
  const product = await Product.findById(id).exec()
  const user = await User.findOne({ email: req.user.email }).exec()

  var existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() == user._id.toString()
    // console.log(element)
  )

  if (existingRatingObject === undefined || existingRatingObject === null) {
    let ratingAdded = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          ratings: {
            star: star,
            postedBy: user._id,
          },
        },
      },
      {
        new: true,
      }
    ).exec()
    res.json(ratingAdded)
  } else {
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { 'ratings.$.star': star } },
      {
        new: true,
      }
    ).exec()
    res.json(ratingUpdated)
  }
}

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.id).exec()

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('subCategory')
    .populate('category')
    .exec()
  res.json(related)
}

//search
//filter
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subCategory', '_id name')
    // .populate('postedBy', '_id name')
    .exec()
  res.json(products)
}

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subCategory', '_id name')
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
}

const handleCategory = async (req, res, category) => {
  console.log(category)
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subCategory', '_id name')
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
}

const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) {
        console.log(err)
        res.json('Try Again Later')
      } else {
        Product.find({ _id: aggregates })
          .populate('category', '_id name')
          .populate('subCategory', '_id name')
          .exec((err, products) => {
            if (err) console.log(err)
            res.json(products)
          })
      }
    })
}

const handleSub = async (req, res, sub) => {
  try {
    const products = await Product.find({ subCategory: sub })
      .populate('category', '_id name')
      .populate('subCategory', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
}

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subcategory } = req.body

  // if (!query && !price && !category && !stars && !stars && !sub) {
  //   res.json('invalid request')
  // }

  if (query) {
    // console.log('query', query)
    await handleQuery(req, res, query)
  }

  if (price !== undefined) {
    // console.log(price)
    await handlePrice(req, res, price)
  }

  if (category) {
    await handleCategory(req, res, category)
  }

  if (stars) {
    await handleStars(req, res, stars)
  }

  if (subcategory) {
    await handleSub(req, res, subcategory)
  }
}

exports.updateProductCount = async (req, res) => {
  const { id, count } = req.body
  if (!count) {
    res.status(400).json('No Quantity Given')
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { quantity: count },
      { new: true }
    )
    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}
