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
    const ownerId = req.user._id

    let media = {}

    if (req.body.text) {
      media.type = "text"
      media.text = req.body.text
    } else if (req.file) {
      let mediaType = "image"
      if (req.file.mimetype.startsWith("video/")) {
        mediaType = "video"
      }

      const result = await uploadMedia(req.file.buffer, mediaType)

      media.type = mediaType
      media.url = result.secure_url
      media.publicId = result.public_id
    }

    const newPostData = {
      owner: ownerId,
      media: media,
    }

    const post = await (await Post.create(newPostData)).populate('owner')

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const index = async (req, res) => {
  try {
    const posts = await Post.find().populate("owner")
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
}

const show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('owner')

    if (!post) {
      return res.status(404).json({ err: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ err: 'Post not found' })
    }

    if (!post.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    )
    updatedPost._doc.owner = req.user

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ err: 'Post not found' })
    }

    if (!post.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json(deletedPost)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}
const like= async(req,res)=>{
    try {
       const like= await Post.findByIdAndUpdate(req.params.id,{
        $push:{ likes: req.params.userId}
    })
    res.status(200).json(like)
    } catch (err) {
    res.status(500).json({ err: err.message })
  }
    
   }
   const unLike = async (req, res) => {
   try {
    
   const unLike= await Post.findByIdAndUpdate(req.params.id, {
        $pull:{ likes: req.params.userId }
    })
 res.status(200).json(unLike)
} catch (err) {
    res.status(500).json({ err: err.message })
}
}
module.exports = {
  create,
  index,
  show,
  update,
  deletePost,
  like,
  unLike,

}