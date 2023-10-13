import Post from "../models/Post.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const file = req.file;

    const fileUrl = getDataUri(file);

    const cloudUri = await cloudinary.uploader.upload(fileUrl.content);

    const newPost = new Post({
      userId,
      title,
      description,
      picturePath: cloudUri.secure_url,
      imageId: cloudUri.public_id,
    });

    await newPost.save();
    res.status(201).json({
      message: "Post Uploaded Successfully",
      post: newPost,
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await Post.find({ userId: id });
    res.status(200).json({
      posts
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const increaseView = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (post) {
      res.json({
        message: "View count incremented successfully",
        post,
      });
    } else {
      res.status(404).json({ error: "Picture not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found.");
      throw error;
    }
    await cloudinary.uploader.destroy(post.imageId);

    await Post.findByIdAndRemove(postId);

    res.status(204).json({
      message: "Post Deleted",
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
