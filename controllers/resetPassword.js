// const Sib = require('@getbrevo/brevo');
// const User = require('../models/user');
// const { where } = require('sequelize');

// exports.resetPasswordMail = async (req, res, next) => {
//     // console.log(req.body);
//     // const {email} = req.body;
//     // console.log(email);

//     try{
//         const {email} = req.body;

//         const existingUser = await User.findOne({where: {
//             email: email
//         }});

//         if (!existingUser) {
//             console.log('User not found');
//             res.status(404).json({message: 'User not found'});
//         };

//         const Sib = require('@getbrevo/brevo');

//         let apiInstance = new Sib.TransactionalEmailsApi();

//         let apiKey = apiInstance.authentications['apiKey'];
//         apiKey.apiKey = 'xsmtpsib-8fc5017d460fc77e4a9885ace799005cb3815c9cfc0acedd29a28beada4804c4-2NSGDBh3qZvAYk9j';
        
//         const sender = {
//             email: 'lalitarchan.180670107034@gmail.com',
//         }
//         const receivers = [{
//             email: email,
//         }]

//         let sendSmtpEmail = new Sib.SendSmtpEmail();

//         sendSmtpEmail.subject = "Reset password for expense tracker app";
//         sendSmtpEmail.htmlContent = `<h3>Link To Reset Password For Expense App</h3>
//                     <a href="http://localhost:3000/password/reset-password"> Click Here to reset password</a>`;
//         sendSmtpEmail.sender = sender;
//         sendSmtpEmail.to = receivers;
//         // await transEmailApi.sendTransacEmail({
//         //     sender,
//         //     To: receivers,
//         //     subject: 'Reset password for expense tracker app',
//         //     textContent: 'Please reset password',
//         //     htmlContent: `<h3>Link To Reset Password For Expense App</h3>
//         //     <a href="http://localhost:3000/password/reset-password"> Click Here to reset password</a>`,
//         // });
//         const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

//         res.status(201).json({success: true}, response);
//     }
//     catch(err) {
//         console.log(err);
//         res.status(500).json({err: err});
//     };
// };
// const Sib = require('sib-api-v3-sdk');
// const User = require('../models/user');

// exports.resetPasswordMail = async (req, res, next) => {
//     try{
//         // console.log('email value >>>>',req.body)
//         const {email} = req.body;

//         // find if email is already present...
//         const existingUser = await User.findOne({where: {email}});
//         if(!existingUser){
//             res.status(404).json({message: 'user not found'});
//         }

//         // store the token in the database...
//         // const response = await Forgotpassword.create({
//         //     id: token,
//         //     active: true,
//         //     userId: existingUser.id
//         // });

//         // send email using send in blue...
//         const client = Sib.ApiClient.instance;
//         const apiKey = client.authentications['api-key'];
//         apiKey.apiKey = process.env.SMTP_KEY;
//         console.log('key:', process.env.SMTP_KEY);

//         const transEmailApi = new Sib.TransactionalEmailsApi();
//         const sender = {
//             'email': 'lalitarchan.180670107034@gmail.com',
//         }
//         const receivers = [{
//             'email': email,
//         }]
//         console.log('receiver---', receivers);

//         await transEmailApi.sendTransacEmail({
//             sender,
//             To: receivers,
//             subject: 'reset password for expense tracker app',
//             textContent: 'please reset password',
//             htmlContent: `<h3>Link To Reset Password For Expense App</h3>
//             <a href="http://localhost:3000/password/reset-password"> Click Here to reset password</a>`,
//         });
//         res.status(201).json({success: true})
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ err: err.message });
//     }
// };
const { createTransport } = require('nodemailer');
const User = require('../models/user');

exports.resetPasswordMail = async (req, res, next) => {
    try{
        console.log('email value >>>>',req.body)
        const {email} = req.body;

        // find if email is already present...
        const existingUser = await User.findOne({where: {email}});
        if(!existingUser){
            res.status(404).json({message: 'user not found'});
        }

        const transporter = createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: "lalitarchan.180670107034@gmail.com",
                pass: process.env.PASS_KEY,
            },
        });
        
        const mailOptions = {
            from: 'lalitarchan.180670107034@gmail.com',
            to: email,
            subject: `Your subject`,
            text: `Your text content`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                throw new Error(JSON.stringify(error));
            } else {
                console.log('Email sent: ' + info.response);
                res.status(201).json({success: true})
            }
        });


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err.message });
    }
}
