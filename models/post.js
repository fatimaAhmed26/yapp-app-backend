const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    media: {
        type:{
            type:String,
            enum:['video','image','text'],
            required:true,
        },
      url: {
        type: String,
        default:null
      },
      publicId: {
        type: String,
        default:null
      },
      text:{
        type:String,
        default:null
      },
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }]
  },
  { timestamps: true },
);
const Post = mongoose.model('Post', postSchema)
module.exports= Post