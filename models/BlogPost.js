const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  body: String,
  image: String,
  datePosted:{
    type: Date,
    default: new Date()   // ⚠️ tous les posts auront la même date (celle du démarrage du serveur)
  },
});

const BlogPost = mongoose.model('BlogPost',BlogPostSchema);
module.exports = BlogPost;