const mongoose = require("mongoose");
commentSchema =new mongoose.Schema({
    comment:{
        type:String,
        required: true,

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
},
postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
},
parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
},

},{ timestamps: true })

const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    media: {
        type:{
            type:String,
        },
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
      },
      text:{
        type:String,
      },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    comment:[commentSchema]
  },
  { timestamps: true },
);
const Post = mongoose.model('Post', postSchema)
module.exports= Post