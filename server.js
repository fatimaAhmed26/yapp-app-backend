const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"])


const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const upload = require('./config/multer')


const PORT = process.env.PORT ? process.env.PORT : "3000"

const authCtrl = require('./controllers/auth')
const usersCtrl = require('./controllers/users')

const verifyToken = require('./middleware/verify-token')

const postCtrl = require('./controllers/post')
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`)
})

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/auth/sign-up', upload.single('profilePic'), authCtrl.signUp)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/users', verifyToken, usersCtrl.index)
app.get('/users/:userId', verifyToken, usersCtrl.show)
app.put('/users/:userId', verifyToken, upload.single('profilePic'), usersCtrl.update)
app.put('/users/:userId/follow', verifyToken, usersCtrl.followToggle)

app.post('/posts', verifyToken, postCtrl.create)
app.get('/posts', verifyToken,postCtrl.index)
app.get('/posts/:postId' , verifyToken, postCtrl.show)
app.put('posts/:postId', verifyToken, postCtrl.update)
app.delete('posts/:postId', verifyToken, postCtrl.deletePost)

app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}! 😀`)
})
