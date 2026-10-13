const User = require("../models/User")
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      username: req.body.username,
      password: hash
    })
    res.redirect('/')
  } catch (error) {
    console.log('ERREUR REGISTER :', error.message)
    res.redirect('/auth/register')
  }
}