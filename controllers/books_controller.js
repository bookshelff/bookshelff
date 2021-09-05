const Book = require('../models/book');
const User = require('../models/user');
const fs = require('fs');
const Fuse = require('fuse.js');
const path = require('path');

module.exports.addBook = async function(req,res){
    return res.render('add_book',{
        title: "Post Book"
    });
};

module.exports.postBook = async function(req,res){
    try{

        Book.uploadedAvatar(req,res,function(err){
            if(err){
                console.log("******* Multer Error", err);
                return res.redirect('back');
            }else{

                let book = Book.create({
                    user: req.user,
                    author: req.body.author,
                    title: req.body.title,
                    location: req.body.location,
                    type: req.body.type,
                    price: req.body.price
                },function(err,book){
                    if(err){
                        console.log("Error in creating a book",err);
                        return res.redirect('back');
                    }else{
                        if(req.file){

                            if(book.avatar){
                                if(fs.existsSync(path.join(__dirname,'..',book.avatar))){
                                    fs.unlinkSync(path.join(__dirname,'..',book.avatar));
                                }
                            }
        
                            book.avatar = Book.avatarPath + '/' + req.file.filename;
                        }
                        book.save();
                        return res.redirect('back');
                    }
                });
            }
        });

    }catch(err){
        if(err){
            console.log("Internal Server Error!",err);
            return res.redirect('back');
        }
    }
};

module.exports.home = function(req,res){
    return res.render('home1',{
        title: 'BookShelf'
    });
};

module.exports.allBooks = async function(req,res){

    try{
        let books = await Book.find({}).populate('user');
        return res.render('all_books',{
            title: 'All Books',
            book: books
        });
    }catch(err){
        console.log("Internal Server Error!",err);
        return res.redirect('back');
    }
    
};

module.exports.remove = async function(req,res){
    try{
        let book = await Book.findById(req.params.id);
        // console.log(book.user._id);
        // console.log(req.user._id);
        if((req.user.email=='aditya.banotra@gmail.com')||(req.user.email=='soodaniket028@gmail.com')){
            if(book.avatar){
                if(fs.existsSync(path.join(__dirname,'..',book.avatar))){
                    fs.unlinkSync(path.join(__dirname,'..',book.avatar));
                }
            }
            book.remove();
            console.log("You're book has been removed!");
            return res.redirect('back');
        }
        
        if(JSON.toString(req.user.id)==JSON.toString(book.user.id)){
            // console.log('here');
            if(book.avatar){
                if(fs.existsSync(path.join(__dirname,'..',book.avatar))){
                    fs.unlinkSync(path.join(__dirname,'..',book.avatar));
                }
            }
            book.remove();
            console.log("You're book has been removed!");
            return res.redirect('back');
        }

        else
        {
            return res.json('401',{
                message: "Unauthorized Request"
            });
        }
        
        
        // return res.redirect('back');
    }catch(err){
        console.log("Internal Server Error!",err);
        return res.redirect('back');
    }
};

module.exports.searchBooks = function(req,res){

    const keyword = req.query.title + req.query.location ;
    // console.log(keyword);

    Book.find({},function(err,books){
        if(err){
            console.log("Error in finding books",err);
        }
        const fuse = new Fuse(books,{
            keys: [
                'title',
                'author',
                'type'
            ]
        });
        // console.log(books);
        
        var result = fuse.search(keyword);
        console.log(result);
        var users = new Array();

        var findUsers = function(){
            for(var i=0;i<result.length;i++){
                User.findById(result[i].item.user,function(err,user){
                    if(err){
                        console.log("User not found!");
                        
                    }else{
                        // searchUsers[i] = user;
                        var obj = new Object();
                        obj = {
                            user: user
                        };
                        console.log(user,);
                        users.push(obj);
                        // console.log(users);
                    }
                });
            }
            if(users.length==result.length)
                return true;
            else return false;
        }
        findUsers();
        var interval = setInterval(function(){
            if(users.length==result.length){
                clearInterval(interval);
                return res.render('searched_books',{
                    title: 'Search Results',
                    book: result,
                    user: users
                }); 
            }
        },50);
    })
   
};