const User = require('../models/user')

exports.user = async (req, res) => {
  const { name, picture, email } = req.user

  const user = await User.findOneAndUpdate(
    { email },
    {
      name: email.split('@')[0],
      picture,
    },
    {
      new: true,
    }
  )

  if (user) {
    // console.log('USER UPDATED', user)
    res.status(200).json(user)
  } else {
    const newUser = await new User({
      email,
      name: email.split('@')[0],
      picture,
    }).save()
    res.status(200).json(newUser)

    // console.log('USER Created', newUser)
  }
}

exports.currentUser = async (req, res) => {
  const { email } = req.user
  User.findOne({ email }).exec((err, user) => {
    if (err) throw new Error(err)
    res.status(200).json(user)
  })
}
