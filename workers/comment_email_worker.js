const queue = require("../config/keu");
const commentsMailer = require("../mailers/comments_mailer");

queue.process('emails',function(job,done){
    // console.log(job.data);
    commentsMailer.newComment(job.data);
    done();
})