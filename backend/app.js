const express = module.require('express');
const bodyParser = module.require('body-parser');
const mongoose = module.require('mongoose');
const path = module.require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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
app.use(bodyParser.urlencoded({ extented: false }));
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
