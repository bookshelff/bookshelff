const Comment = require('../models/comment');
const commentsMailer = require('../mailers/comments_mailer');
const Post = require('../models/post');
const queue = require('../config/keu');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
module.exports.create = function(req,res){

    Post.findById(req.body.post,function(err,post){

        if(err) {
            console.log('Error in finding post!');
            return;
        }
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            },function(err,comment){

                if(err) {
                    req.flash('error',err);
                    console.log('Error in creating comment!');
                    return;
                }
                post.comments.push(comment);
                post.save();
                comment.user = req.user;
                // commentsMailer.newComment(comment);

                let job = queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log('Error in sending the email to the queue!', err);
                        return;
                    }
                    console.log("Job Enqueued!",job.id);
                });

                req.flash('success','Comment Added');
                res.redirect('back');
            });
        }

    });

};

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id).populate('post').exec(function(err,comment){
        if(err){
            console.log('Error in finding comment while deleting it!');
            req.flash('error',err);
            return res.redirect('back');
        }

        if((comment.user == req.user.id)||(comment.post.user==req.user.id)){
            const postID = comment.post;
            Like.deleteMany({likable: comment._id, onModel:"Comment"});
            comment.remove();
            Post.findByIdAndUpdate(postID,{$pull: {comments:req.params.id}},function(err,post){
                if(err){
                    console.log('Error in finding post while deleting the comment of that post');
                    req.flash('error',err);
                    return res.redirect('back');
                }
                req.flash('success','Comment Deleted');
                return res.redirect('back');
            });
        }else{
            res.redirect('back');
        }
    });
};