const express = module.require("express");
const Post = module.require('../models/post');

const router = express.Router();

router.post('', (req, res, next) => {
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

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: documents
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404);
    }
  });
});

router.put('/:id', (req, res, next) => {
  Post.findOne({_id: req.params.id})
  .then(document => {
    document.title = req.body.title;
    document.content = req.body.content;
    document.save().then(result =>{
      res.status(200).json({ message: "Update Successful!" });
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(() => {
    res.status(200).json({message: 'Post Deleted'});
  });
});

module.exports = router;
