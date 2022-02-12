const ContactUs = require('../models/contactus')
const nodemailer = require('nodemailer')

exports.createContactForm = async (req, res) => {
  // console.log(req.body)
  try {
    const newContact = await new ContactUs(req.body).save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    })

    var mailOptions2 = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: 'Mercury Mega Mart - New Contact Us Form Received',
      html: `<p>Hi, New Contact Us has been received from the mail <b>${newContact.email}</b> <br/>
      form  id : <b>${newContact._id}</b> <br/>
      
    </p>`,
    }
    transporter.sendMail(mailOptions2, (error, info) => {
      if (error) {
        console.log(error)
      }
    })

    res.json(newContact)
  } catch (error) {
    res.status(400).json(error)
    console.log(error)
  }
}

exports.allContact = async (req, res) => {
  const forms = await ContactUs.find({}).sort([['createdAt', 'desc']])
  res.json(forms)
}

exports.removeContactUs = async (req, res) => {
  let { id } = req.params
  try {
    const removed = await ContactUs.findByIdAndDelete(id).exec()
    res.json(removed)
  } catch (error) {
    res.status(400).json(error)
  }
}
