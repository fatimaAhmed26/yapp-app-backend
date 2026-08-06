const User = require('../models/user')

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

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {bio: req.body.bio, profilePic: req.body.profilePic}, {new: true}
        )

        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

module.exports = {
    index,
    show,
    update,
}