const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())


//Install NODEMAILER
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "alakarsamy2014@gmail.com",
    pass: "hvok xjit cpri dmda",
  },
});

const emailTemplate = (msg, recipient) => ({
    from: "alakarsamy2014@gmail.com",
    to: recipient,
    subject: 'You get Text Message from Your App!',
    text: msg,
})  
const sendMails = ({msg, emailList}) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const recipient of emailList) {
                const mailOptions = emailTemplate(msg, recipient);
        
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipient}`);
            }
            resolve("Success")
        } catch (error) {
            console.error('Error sending emails:', error.message);
            reject(error.message)
        }
    })
};

app.post("/sendemail",function(req,res){

    sendMails(req.body).then((response) => {
        console.log(response)
        res.send(true);
    })
    .catch((error) => {
        res.send(false);
    })

})

app.listen(5000,function(){
    console.log("Server Started.....")
})