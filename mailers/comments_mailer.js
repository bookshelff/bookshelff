const nodeMailer = require('../config/nodemailer');

module.exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment:comment},"/comments/new_comment.ejs");

    console.log(comment);
    nodeMailer.transporter.sendMail({
        from: "aniketsood.bt19ece@pec.edu.in",
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
    },(err,info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log("Mail Sent", info);
        return;
    });
}