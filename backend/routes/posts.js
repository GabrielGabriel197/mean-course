const express = module.require("express");
const router = express.Router();
const multer = require("multer");

const Post = module.require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
});

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post Added Successfully',
        post: {
          id: createdPost._id,
          title: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  let fetchedPosts;
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedPosts,
        maxPosts: count,
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

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
  Post.findOne({_id: req.params.id})
  .then(document => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }

    document.title = req.body.title;
    document.content = req.body.content;
    document.imagePath = imagePath;

    document.save().then(result =>{
      res.status(200).json({ message: "Update Successful!", post: result });
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
