const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/newBlog");

const BlogPost = require('./models/BlogPost.js');

async function tp() {

  // create a blogpost
  const created = await BlogPost.create({
    title: 'title blog',
    body: 'description blog'
  }).then((blogspost) => {
    console.log(null, blogspost)
    return blogspost
  }).catch((error) => {
    console.log(error, null)
  })

  //read blogpost only a record
  await BlogPost.find({title:'title blog'}).then((blogpost) =>{
    console.log(null, blogpost)
  }).catch((error) => console.log(error, null))

  //read all blogposts with 'blog' in the title
  await BlogPost.find({title:/blog/}).then((blogpost) =>{
    console.log(null, blogpost)
  }).catch((error) => console.log(error, null))

  //read a document by Id
  var id = created._id;
  await BlogPost.findById(id).then((blogpost) =>{
    console.log(null, blogpost)
  }).catch((error) => console.log(error, null))

  //update a document by Id
  await BlogPost.findByIdAndUpdate(id,{
    title: 'update post',body:'update description'}).then((blogpost) =>{
    console.log(null, blogpost)
  }).catch((error) => console.log(error, null))

  //delete a document by Id
  await BlogPost.findByIdAndDelete(id).then((blogpost) =>{
    console.log(null, blogpost)
  }).catch((error) => console.log(error, null))

  mongoose.disconnect();
}

tp();