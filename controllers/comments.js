const Post = require("../models/post")

const create = async (req, res) => {
try {
    
    const post = await Post.findById(req.params.postId)
    if (!post){
        return res.status(400).json({ err: 'Post not found.' })
    }
    req.body.author = req.user._id
    post.comment.push(req.body)
    await post.save()

        const newComment = post.comment[post.comment.length - 1 ]

        res.status(201).json(newComment)
} catch (err) {
    res.status(500).json({ err: err.message })
}
}


const deleteComment = async (req, res) => {
    try {
    const post = await Post.findById(req.params.postId)
     if (!post){
        return res.status(400).json({ err: 'Post not found.' })
    }
    const comment = post.comment.id(req.params.commentId)
    if (!comment){
            return res.status(400).json({err: 'Comment not found'})
        }

    if (comment.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" })}

    post.comment.pull({ _id: req.params.commentId })
    await post.save()
    res.status(200).json({message: 'comment deleted'})
    } catch (err) {
        res.status(500).json({ err: err.message })
    }

}

module.exports = {
    create,
    deleteComment,

}