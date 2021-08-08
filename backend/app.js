const express = module.require('express');
const app = express();

app.use('/api/posts',(req, res, next) => {
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
