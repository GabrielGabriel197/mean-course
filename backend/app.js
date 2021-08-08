const express = module.require('express');
const bodyParser = module.require('body-parser');
const mongoose = require('mongoose');
const { isPostfixUnaryExpression } = require('typescript');

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
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post Added Successfully',
        postId: createdPost._id
      });
    });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: documents
      });
    });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404);
    }
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  Post.findOne({_id: req.params.id})
  .then(document => {
    document.title = req.body.title;
    document.content = req.body.content;
    document.save().then(result =>{
      res.status(200).json({ message: "Update Successful!" });
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(() => {
    res.status(200).json({message: 'Post Deleted'});
  });
});

module.exports = app;
