//  IMPORTS (librairies)
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');

//  IMPORTS (controllers)
const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

//  IMPORTS (middlewares perso)
const validateMiddleware = require('./middleware/ValidationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

//  CRÉATION DE L'APPLICATION  (tout ce qui suit utilisE )
var app = express();

//  CONNEXION MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/newBlog')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB :', err.message));

//  MOTEUR DE VUES (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  MIDDLEWARES GÉNÉRAUX
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// session
app.use(expressSession({
  secret: 'nodejs est top',
  resave: false,
  saveUninitialized: false
}));

// validation des posts (après fileUpload)
app.use('/posts/store', validateMiddleware);

// variable globale loggedIn (pour le menu)
global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

//  ROUTES
// accueil et posts
app.get('/', homeController);
app.get('/posts/new', authMiddleware, newPostController);
app.get('/post/:id', getPostController);
app.post('/posts/store', authMiddleware, storePostController);

// register
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

// login
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

// logout
app.get('/auth/logout', logoutController);

// ===================================================================
//  GESTION DES ERREURS
// ===================================================================
// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// gestionnaire d'erreurs
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;