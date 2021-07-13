const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
module.exports.create = async function(req,res){
    
    try{
        let post = await Post.create({
            content : req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    user: req.user.name
                },
                message: 'Post Created!'
            });
        }

        req.flash('success','Post Created');
        res.redirect('back');
    }catch(err){
        console.log('Error', err);
        req.flash('error',err);
        return res.redirect('back');
    }
};

// module.exports.create = function(req,res){
//     Post.create({
//         content : req.body.content,
//         user: req.user._id
//     }, function(err,post){
//         if(err){
//             console.log("Error while creating post!");
//         }

//         res.redirect('back');
//     });
// };

module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);
        // .id will convert object to string
        if(post.user == req.user.id){

            await Like.deleteMany({likable:post,onModel:"Post"});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();
            await function(){
                Comment.deleteMany({post: req.params.id});
            };
            if(req.xhr){
                return res.status(200).json({
                    post_id: req.params.id,
                    message: 'Post Deleted'
                });
            }
            req.flash('success','Post Deleted');
            
        }else{
            req.flash('error','You cannot delete this post');
        }
        res.redirect('back');
    }catch(err){
        console.log('Error',err);
        req.flash('error',err);
        res.redirect('back');
    }
};
// module.exports.destroy = function(req,res){

//     Post.findById(req.params.id,function(err,post){
//         if(err){
//             console.log('Error in finding Post while deleting it!');
//             return res.redirect('back');
//         }
//         // .id will convert object to string
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id},function(err){
//                 if(err){
//                     console.log('Error in deleting comments in the deleted post!');
//                     return;
//                 }
//                 res.redirect('back');
//             });
//         }
//         else{
//             res.redirect('back');
//         }
//     });

// };