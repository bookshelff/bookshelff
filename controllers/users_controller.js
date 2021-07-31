const { resolveInclude } = require('ejs');
const User = require('../models/user');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const Book = require('../models/book');
const resetPassMailer = require('../mailers/reset_password');
const signUpMailer = require('../mailers/sign_up');

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

module.exports.profile = function(req,res){
    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id,function(err,user){
    //         if(err) {console.log("Error in finding user while logging in!"); return;}
    User.findById(req.params.id,function(err,user){
        if(err){
            console.log('Error in finding the User');
            return res.redirect('back');
        }

        Book.find({user: req.params.id}).populate('user').exec(function(err,books){
            return res.render('profile',{
                title: 'User Profile',
                profile_user: user,
                books: books
            });
        });
    });
    //     });
    // }else{
    //     res.redirect('/users/sign-in');
    // }
};

module.exports.update = async function(req,res){
    try{
        if(req.user.id==req.params.id){
            let user = await User.findById(req.user.id);
           

            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("******* Multer Error", err);
                    return res.redirect('back');
                }else{
                    // console.log(req.body);
                    // console.log(user);
                    user.name = req.body.name;
                    user.phone = req.body.phone;
                    user.email = req.body.email;
                    user.save();
                    if(req.file){
                        if(user.avatar){
                            if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                                fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                            }
                        }
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    return res.redirect('back');
                }
            });
        }else{
            return res.status(401).send('Unauthorized');
        }
    }catch(err){
        console.log('Error', err);
        req.flash('error',err);
        return res.redirect('back');
    }
};

module.exports.posts = function(req,res){
    res.writeHead('200',{'content-type':'text/html'});
    return res.end("<h2> User's Posts </h2>");
};

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/' + req.user._id);
    }
    return res.render("user_sign_up",{
        title: "Bookshelff | Sign Up"
    });
};

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/' + req.user._id);
    }
    return res.render("user_sign_in",{
        title: "Bookshelff | Sign In"
    });
};

module.exports.create = function(req,res){

    if(req.body.password!=req.body.confirm_password){
        // alert("Password and confirm password don't match");
        console.log("Password and confirm password don't match");
        return res.redirect('back');
    }

    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log("Error in finding email in sign-up!");
            return res.redirect('back');
        }
        else{
            if(user){
                console.log("Email already exists!");
                // alert("Email already exists!");
                return res.redirect('/users/sign-in');
            }
            else{
                req.body.password = crypto.randomBytes(10).toString('hex');
                User.create(req.body,function(err,user){
                    if(err){
                        console.log("Error in creating a user!");
                        return res.redirect('back');
                    }
                    // alert("User created successfully!");
                    user.resetPassword.accessToken = generateOTP();
                    user.resetPassword.isValid = true;
                    signUpMailer.signUp(user);
                    user.resetPassword.time = (Date.now()/1000);
                    console.log("User created successfully!");
                    return res.redirect('/users/set-password');
                });
            }
        }
    });
};

module.exports.createSession = function(req,res){

    // User.findOne({email: req.body.email}, function(err,user){
    //     if(err){
    //         console.log("Error in finding email in sign-in!");
    //         return res.redirect('back');
    //     };

    //     if(!user){
    //         console.log("User not found!");
    //         return res.redirect('back');
    //     }
    //     else if(req.body.password!=user.password){
    //         console.log("Incorrect Password!");
    //         return res.redirect('back');
    //     }
    //     else{
    //         res.cookie('user_id',user.id);
    //         return res.redirect('/users/profile');
    //     }

    // });
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');

};

// module.exports.signOut = function(req,res){

//     // res.clearCookie('user_id');
//     res.clearCookie('Social');
//     return res.redirect('/users/sign-in');

// };

module.exports.destroySession = function(req,res){

    // res.clearCookie('user_id');
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    // this message has to be passed to response
    return res.redirect('/users/sign-in');

};

module.exports.resetPassword = function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in finding email!",err);
            return;
        }
        if(!user){
            console.log("No Such User Found!");
            // alert("No Such User Found!");
            return res.redirect('/users/sign-in');
        }
        user.resetPassword.accessToken = generateOTP();
        user.resetPassword.isValid = true;
        resetPassMailer.resetPassword(user);
        user.resetPassword.time = (Date.now()/1000);
        user.save();
        res.redirect('/users/set-password');
    });
}
;
module.exports.setPassword = function(req,res){
    res.render('set-password',{
        title: "Reset Password"
    });
};

module.exports.setNewPassword = function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in finding user!",err);
            return;
        }
        if(!user){
            console.log("Email not found!")
            return res.redirect('back');
        }
        // console.log(user.resetPassword);
        // console.log(req.body.otp)
        if(user.resetPassword.accessToken!=req.body.otp){
            console.log('Wrong OTP!');
            return res.redirect('back');
        }
        if((((Date.now()/1000)-user.resetPassword.time)>600)||(!user.resetPassword.isValid)){
            user.resetPassword.isValid = false;
            console.log("OTP Expired! Please request for an OTP again.");
            return res.redirect('/users/sign-in');
        }
        if(req.body.password!=req.body.confirm_password){
            console.log("Password not matched!");
            return res.redirect('back');
        }
        user.password = req.body.password;
        user.resetPassword.isValid = false;
        user.save();
        console.log("Password changed successfully!");
        // console.log(req.body.password);
        return res.redirect('/users/sign-in');
    });
};