const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary')
const User = require('../models/user')

// const signToken = (req, res) => {

//     const user = {
//         id: 1,
//         username: 'test',
//         password: 'test',
//     }

//     // create a token
//     const token = jwt.sign({ user }, process.env.JWT_SECRET)
//     res.json({ token })
// }

// const verifyToken = (req, res) => {
//     const token = req.headers.authorization.split(' ')[1]
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     res.json({ decoded })
// }

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


const signUp = async (req, res) => {
    try {
        // check if user in database already
        const userInDatabase = await User.findOne({
            username: req.body.username
        })

        if (userInDatabase) {
            return res.status(409).json({ err: 'Username already taken.' })
        }

        // creates user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)

        let profilePicUrl = ''

        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer)
            profilePicUrl = uploadImage.secure_url
        }
        
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            bio: req.body.bio,
            profilePic: profilePicUrl,
        }

        const user = await User.create(userData)

        // create the payload
        const payload = { username: user.username, _id: user._id }

        // create the token with payload + secret
        const token = jwt.sign({payload}, process.env.JWT_SECRET)

        res.status(201).json({ token })
    } catch(err) {
        res.status(400).json({ err: err.message })
    }
}

const signIn = async (req, res) => {
    try {
        // check if user in database already
        const userInDatabase = await User.findOne({
            username: req.body.username
        })

        if (!userInDatabase) {
            return res.status(404).json({ err: 'User does not exist.' })
        }

        // check if the user's password is correct
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)

        if (!validPassword) {
            return res.status(401).json({ err: 'Login failed. Please try again.' })
        }

        const payload = { username: userInDatabase.username, _id: userInDatabase._id }
        const token = jwt.sign({ payload }, process.env.JWT_SECRET)

        res.status(200).json({ token })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = {
    // signToken,
    // verifyToken,
    signUp,
    signIn,
}