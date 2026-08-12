# yapp-app-backend
## The Express/MongoDB API powering the Yapp social media app.
# Getting Started

• Deployed API 

https://joyful-flan-714bd6.netlify.app

• Frontend Repo 

https://github.com/fatimaAhmed26/yapp-app-frontend.git


• Planning Materials / Trello Board

https://trello.com/invite/b/6a72d78607ab1f450a434840/ATTI09debdf990b44fc7093276d9725749d8F2BD935B/social-media-app


#Description
This is the backend for Yapp app it handles user authentication, posts (with media uploads via Cloudinary), comments, likes, and the follow/follower system, all backed by MongoDB via Mongoose.

# Technologies Used

• Node.js.

• Express.

• MongoDB / Mongoose.

• JWT (jsonwebtoken) for authentication.

• bcrypt for password hashing.

• Multer for handling file uploads.

• Cloudinary for media storage.

• Morgan for request logging.


## When installed  

PORT=3000

MONGODB_URI= your MongoDB connection string

JWT_SECRET= your JWT secret

CLOUDINARY_CLOUD_NAME= your Cloudinary cloud name

CLOUDINARY_API_KEY= your Cloudinary API key

CLOUDINARY_API_SECRET= your Cloudinary API secret

###Installation

npm install

npm run dev

## Next Steps

• Add pagination to GET /posts for large datasets.


• Add rate limiting on auth routes.


• Add input validation/sanitization middleware.


• Add reply threads for comments (nested comments).


### Attributions

• Cloudinary for media hosting.
• Claude for the style.
