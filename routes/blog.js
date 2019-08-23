const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:blogId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    res.json(blog);
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/:blogId", async (req, res) => {
  try {
    const removedBlog = await Blog.deleteOne({ _id: req.params.blogId });
    res.json(removedBlog);
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch("/:blogId", async (req, res) => {
  try {
    const updatedBlog = await Blog.updateOne(
      { _id: req.params.blogId },
      {
        $set: {
          title: req.body.title,
          desc: req.body.desc,
          imageUrl: req.body.imageUrl
        }
      }
    );
    // res.json(updatedBlog);
    res.redirect("/api/blogs/" + req.params.blogId);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    desc: req.body.desc,
    imageUrl: req.body.imageUrl
  });
  blog
    .save()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.json({ message: err });
    });
});

module.exports = router;
