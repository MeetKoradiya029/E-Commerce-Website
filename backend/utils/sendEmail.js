const nodemailer = require('nodemailer');

const sendgrid = require('@sendgrid/mail');
const userModel = require('../models/userModel');

sendgrid.setApiKey("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");





const sendEmail = async(options) => {

  const msg = {
    to: options.email, // Change to your recipient
    from: process.env.SMTP_MAIL, // Change to your verified sender
    subject: options.subject,
    text: options.message,
    html: options.html,
  }
  await sendgrid
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })


//   const transporter = nodemailer.createTransport({
    
//     host:"smtp.gmail.com",
//     port: 465,
//     secure: true,
//     service:process.env.SMTP_SERVICE,
//     auth:{
//         user:"meetmk720@gmail.com",
//         pass:"Meet@#720"

//     }
//   })

//   const mailOptions = {
//     from:"meetmk720@gmail.com",
//     to:options.email,
//     subject:options.subject,
//     text:options.message,
// }
//     await transporter.sendMail(mailOptions);
// }
  }
module.exports = sendEmail