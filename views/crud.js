// CRUD du TP (pages 9 à 11) — version compatible Mongoose 7+
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/newBlog');
  console.log('MongoDB connecté\n');

  // ---------- CREATE (page 9) ----------
  const nouveau = await BlogPost.create({
    title: 'title blog',
    body: 'description blog'
  });
  console.log('CREATE :', nouveau, '\n');

  const id = nouveau._id; // on garde l'id pour la suite

  // ---------- READ (page 10) ----------
  // Lire les posts dont le titre est exactement 'title blog'
  const exact = await BlogPost.find({ title: 'title blog' });
  console.log('READ titre exact :', exact, '\n');

  // Lire tous les posts dont le titre CONTIENT 'blog' (comme % en SQL)
  const contient = await BlogPost.find({ title: /blog/ });
  console.log('READ titre contient "blog" :', contient, '\n');

  // ---------- READ par ID (page 11) ----------
  const parId = await BlogPost.findById(id);
  console.log('READ par id :', parId, '\n');

  // ---------- UPDATE (page 11) ----------
  const modifie = await BlogPost.findByIdAndUpdate(
    id,
    { title: 'update post', body: 'update description' },
    { new: true } // renvoie la version modifiée
  );
  console.log('UPDATE :', modifie, '\n');

  // ---------- DELETE (page 11) ----------
  const supprime = await BlogPost.findByIdAndDelete(id);
  console.log('DELETE :', supprime, '\n');

  await mongoose.disconnect();
  console.log('Terminé, déconnecté.');
}

main().catch(err => console.error('Erreur :', err));