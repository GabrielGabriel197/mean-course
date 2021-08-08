const express = module.require('express');
const app = express();
const bodyParser = module.require('body-parser');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.post('api/posts', (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: 'Post Added Successfully'
  })
});

app.get('/api/posts',(req, res, next) => {
  const posts = [
    { id: 'aer234', title: 'test', content: 'testing the tests of tests'},
    { id: '213yu12', title: 'test', content: 'testing the tests of tests'},
  ]
  res.status(200).json({
    message: 'Posts fetched succesfully',
    posts: posts
  });
});

module.exports = app;
