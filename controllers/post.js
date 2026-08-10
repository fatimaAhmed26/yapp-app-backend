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
  console.log(req.file)
  try {
    const ownerId = req.user._id

    let media = {}

    if (req.file) {
      const mediaType = req.file.mimetype.split("/")[0]
      const result = await uploadMedia(req.file.buffer, mediaType)

      media.type = mediaType
      media.url = result.secure_url
      media.publicId = result.public_id
    }

    const newPostData = {
      owner: ownerId,
      media: media,
      text: req.body.text,
    }

    const post = await (await Post.create(newPostData)).populate('owner')

    res.status(201).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: err.message })
  }
}

const index = async (req, res) => {
  try {
    const posts = await Post.find().populate("owner")
    console.log(posts,"posts");
    
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

const likeToggle = async (req, res) => {
    try {
        const currentPost = await Post.findById(req.post._id)
        const targetPost = await Post.findById(req.params.postId)

        if (!targetPost) {
            return res.status(404).json({err: 'post not found.'})
        }
        if (req.params.postId === req.post._id) {
            return res.status(400).json({err: 'You cant like your post.'})
        }

        const isLiked = currentPost.likes.includes(req.params.postId)

        if (isLiked) {
            currentPost.likes.pull(req.params.postId)
            targetPost.likes.pull(req.post._id)
        } else {
            currentPost.likes.push(req.params.postId)
            targetPost.likes.push(req.post._id)
        }

        await currentPost.save()
        await targetPost.save()

        res.json(currentPost)
        
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

module.exports = {
  create,
  index,
  show,
  update,
  deletePost,
  likeToggle,

}