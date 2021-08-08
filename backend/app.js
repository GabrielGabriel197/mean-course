const express = module.require('express');
const bodyParser = module.require('body-parser');
const mongoose = require('mongoose');

const Post = module.require('./models/post');

const uri = "mongodb+srv://gabreil:1Bv5ZcKqA4SvMSCk@mean.wucfp.mongodb.net/node-angular?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((e) => {
    console.log(e);
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post Added Successfully'
  })
});

app.get('/api/posts',(req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: documents
      });
    });
});

module.exports = app;
