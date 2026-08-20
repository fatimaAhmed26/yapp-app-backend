const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const upload = require('./config/multer');
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  'https://joyful-flan-714bd6.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(morgan('dev'));


const authCtrl = require('./controllers/auth');
const usersCtrl = require('./controllers/users');
const commentsCtrl = require('./controllers/comments');
const verifyToken = require('./middleware/verify-token');
const postCtrl = require('./controllers/post');


app.post('/auth/sign-up', upload.single('profilePic'), authCtrl.signUp);
app.post('/auth/sign-in', authCtrl.signIn);

app.get('/users', verifyToken, usersCtrl.index);
app.get('/users/:userId', verifyToken, usersCtrl.show);
app.put('/users/:userId', verifyToken, upload.single('profilePic'), usersCtrl.update);
app.put('/users/:userId/follow', verifyToken, usersCtrl.followToggle);
app.delete('/users/:userId', verifyToken, usersCtrl.deleteUser);

app.post('/posts', verifyToken, upload.single('media'), postCtrl.create);
app.get('/posts', verifyToken, postCtrl.index);
app.get('/posts/:postId', verifyToken, postCtrl.show);
app.put('/posts/:postId', verifyToken, upload.single('media'), postCtrl.update);
app.delete('/posts/:postId', verifyToken, postCtrl.deletePost);
app.put('/posts/:postId/liked', verifyToken, postCtrl.likeToggle);

app.post('/posts/:postId/comments', verifyToken, commentsCtrl.create);
app.delete('/posts/:postId/comments/:commentId', verifyToken, commentsCtrl.deleteComment);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`);
    app.listen(PORT, () => {
      console.log(`The express app is ready on port ${PORT}! 😀`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });