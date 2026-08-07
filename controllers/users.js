const User = require('../models/user')
const cloudinary = require('../config/cloudinary')

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'yapp-profile-pics',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

const index = async (req, res) => {
   const users = await User.find()
   res.json(users)
}

const show = async (req, res ) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).json({err: 'User not found.'})
        }
        res.json(user)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

const update = async (req, res) => {
    try {
        if (req.params.userId !== req.user._id) {
            return res.status(403).json({ err: 'Unauthorized.'})
        }

        const updateData = {bio: req.body.bio}
        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer)
            updateData.profilePic = uploadedImage.secure_url
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            updateData,
            {new: true}
        )

        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

const followToggle = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        const targetUser = await User.findById(req.params.userId)

        if (!targetUser) {
            return res.status(404).json({err: 'User not found.'})
        }
        if (req.params.userId === req.user._id) {
            return res.status(400).json({err: 'You cant follow youself.'})
        }

        const isFollowing = currentUser.following.includes(req.params.userId)

        if (isFollowing) {
            currentUser.following.pull(req.params.userId)
            targetUser.followers.pull(req.user._id)
        } else {
            currentUser.following.push(req.params.userId)
            targetUser.followers.push(req.user._id)
        }

        await currentUser.save()
        await targetUser.save()

        res.json(currentUser)
        
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

module.exports = {
    index,
    show,
    update,
    followToggle,
}