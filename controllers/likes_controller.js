const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');

module.exports.toggleLike = async function(req,res){
    try{
        // likes/toggle/?id=abcdef&type=Post
        let likable;
        let deleted = false;

        if(req.query.type=='Post'){
            likable = await Post.findById(req.query.id).populate('likes');
        }else{
            likable = await Comment.findById(req.query.id).populate('likes');
        }
        
        let existingLike = await Like.findOne({
            user: req.user._id,
            onModel: req.query.type,
            likable: req.query.id
        });
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                onModel: req.query.type,
                likable: req.query.id
            });
            likable.likes.push(newLike._id);
            likable.save();
        }
        return res.json(200,{
            message: "Request Successful",
            data: {
                deleted: deleted
            }
        });
    }catch(err){
        console.log('Internal Server Error!',err);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
};