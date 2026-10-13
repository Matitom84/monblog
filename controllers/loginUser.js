const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username: username })

  if (user) {
    const same = await bcrypt.compare(password, user.password)
    if (same) {
      req.session.userId = user._id   // on mémorise l'utilisateur dans la session
      return res.redirect('/')
    } else {
      return res.redirect('/auth/login')
    }
  } else {
    return res.redirect('/auth/login')
  }
}
