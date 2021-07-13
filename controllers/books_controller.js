const Book = require('../models/book');
const fs = require('fs');
// const fuse = require('../config/fuse');
const Fuse = require('fuse.js');

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
                    type: req.body.type
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
        console.log(book.user._id);
        console.log(req.user._id);

        if(req.user._id!=book.user._id){
            return res.json('401',{
                message: "Unauthorized Request"
            });
        }
        
        console.log('here');
        if(book.avatar){
            if(fs.existsSync(path.join(__dirname,'..',book.avatar))){
                fs.unlinkSync(path.join(__dirname,'..',book.avatar));
            }
        }
        book.remove();
        console.log("You're book has been removed!");
        return res.redirect('back');
        return res.redirect('back');
    }catch(err){
        console.log("Internal Server Error!",err);
        return res.redirect('back');
    }
};

module.exports.searchBooks = function(req,res){

    const keyword = req.body.title + req.body.location ;
    console.log("dsffsd",req.body);

    Book.find({},function(err,books){
        if(err){
            console.log("Error in finding books",err);
        }
        console.log(books);
        const fuse = new Fuse(books,{
            keys: [
                'title',
                'author',
                'type'
            ]
        });
    
        const result = fuse.search(keyword);
        console.log(result);
    });
};