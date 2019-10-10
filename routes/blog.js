const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created: -1 });
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
    res.json({ message: "Deleted" });
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
          image_url: req.body.image_url
        }
      }
    );
    // res.json(updatedBlog);
    res.json({ message: "Updated" });
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/create", (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    desc: req.body.desc,
    image_url: req.body.image_url
  });
  blog
    .save()
    .then(data => {
      res.status(200).json({ message: "Created", createdBlog: data });
    })
    .catch(err => {
      res.json({ message: err });
    });
});

module.exports = router;
