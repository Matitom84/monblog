const User = require('../models/User')

module.exports = async (req, res, next) => {
  console.log('AUTH - userId en session :', req.session.userId)   // ← test
  const user = await User.findById(req.session.userId)
  if (!user) {
    console.log('AUTH - pas connecté, redirection accueil')       // ← test
    return res.redirect('/')
  }
  next()
}