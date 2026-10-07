var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newBlog');   // ⚠️ sur Mac, si erreur ECONNREFUSED ::1, remplace localhost par 127.0.0.1
const BlogPost = require('./models/BlogPost.js');

// ⚠️ le prof dit d'enlever cette ligne : elle entre en conflit avec la route /index ci-dessous
// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.redirect('/index');
});

app.get('/index', async (req, res) => {
  try {
    const blogposts = await BlogPost.find({});
    console.log(blogposts);
    res.render('index', { blogposts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).send('Oops! Something went wrong.');
  }
});

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.get('/post', (req, res) => {
  res.redirect('/posts/new')
})

app.get('/posts/new', (req, res) => {
  res.render('create')
});

app.post('/posts/store', async (req, res) => {
  try {
    let image = req.files.image;
    // Move the uploaded image to the specified path
    await image.mv(path.resolve(__dirname, 'public/assets/img', image.name))
    // Create a new blog post with the image path
    await BlogPost.create({
      ...req.body,
      image: '/assets/img/' + image.name
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).send('Oops! Something went wrong.');
  }
});

app.get('/post/:id', async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post', { blogpost })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;