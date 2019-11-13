const express = require("express");

// LOCAL IMPORTS
const Blog = require("../models/blog");
const User = require("../models/user");
const verify = require("../middlewares/verify-auth");

const router = express.Router();

router.get("/", verify, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .select("title desc creator created_time image_url")
      .sort({ created_time: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select(
      "title desc creator created_time image_url"
    );
    if (!blog) {
      return res.status(404).json({ message: "data not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(404).json({ message: "data not found", error });
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const blog = await Blog.findById(req.params.id);
    if (user.username === blog.creator) {
      await Blog.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Deleted" });
    }
    res.status(401).json({ message: "you are unauthorized" });
  } catch (error) {
    res.status(404).json({ message: "data not found", error });
  }
});

router.patch("/:id", verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const blog = await Blog.findById(req.params.id);
    if (user.username === blog.creator) {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            desc: req.body.desc,
            image_url: req.body.image_url
          }
        }
      );
      return res.status(200).json({ message: "Updated" });
    }
    res.status(401).json({ message: "you are unauthorized" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/create", verify, (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    desc: req.body.desc,
    image_url: req.body.image_url,
    creator: req.user.username
  });
  blog
    .save()
    .then(data => {
      res.status(201).json({ message: "Created", createdBlog: data });
    })
    .catch(err => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
