const cloudinary = require('../config/cloudinary');
const Post = require('../models/post');

const uploadMedia = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "yapp-posts",
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const create = async (req, res) => {
  try {
    let postData = {}

    postData.owner = req.session.user._id
    postData.media = {}

    if (req.body.text) {
      postData.media.type = "text"
      postData.media.text = req.body.text
    } else if (req.file) {
      const mediaType = req.file.mimetype.startsWith("video/")
        ? "video"
        : "image"

      const result = await uploadMedia(req.file.buffer, mediaType)

      postData.media.type = mediaType
      postData.media.url = result.secure_url
      postData.media.publicId = result.public_id
    }

    const post = await Post.create(postData)
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
const index = async (req, res) => {
    try {
        
        const posts = await Post.find().populate("owner")
        res.status(200).json(posts)
    } catch (error) {
         res.status(500).json({ err: err.message })
    }
}

const show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.hootId).populate('author')
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}
const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    )

    res.status(202).json(updatedPost)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}
module.exports = {
    create,
    index,
    show,
    update,

}