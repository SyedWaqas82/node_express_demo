const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const validateRequest = require('../middlewares/validate_request');
const schemas = require('../schemas');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post('/', validateRequest(schemas.postPost), async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    created_by: `${req.user.first_name} ${req.user.last_name}`,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json(removedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.patch('/:postId', validateRequest(schemas.postPatch), async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: { title: req.body.title, description: req.body.description } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
