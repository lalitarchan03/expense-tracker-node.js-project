
const { createTransport } = require('nodemailer');

const User = require('../models/user');
const ForgotPasswordRequests = require('../models/forgotpassword');

const path = require('path');
const url = require('url');   
const bcrypt = require('bcrypt');
const { where } = require('sequelize');


exports.resetPasswordMail = async (req, res, next) => {
    try{
        
        const uuid = await crypto.randomUUID();
        const {email} = req.body;
        // console.log('email value >>>>',req.body)

        // find if email is already present...
        const existingUser = await User.findOne({where: {email}});
        if(!existingUser){
            res.status(404).json({message: 'user not found'});
            return
        }

        // console.log(existingUser.id)

        const data = await ForgotPasswordRequests.create({id: uuid, userId: existingUser.id, isActive: true, isUpdated: false});
        // console.log(data,"-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")

        const transporter = createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                user: "lalitarchan.180670107034@gmail.com",
                pass: process.env.PASS_KEY,
            },
        });
        
        const mailOptions = {
            from: {
                name: 'Expense Tracker',
                address: 'lalitarchan.180670107034@gmail.com'
            },
            to: email,
            subject: `Expense Tracker App Reset Password Link`,
            text: `You are getting this mail because we have received your request to reset your account password`,
            html: `You are getting this mail because we have received your request to <a href="http://localhost:3000/password/resetpassword/${uuid}">reset your account password</a>`
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
        // console.log(`http://localhost:3000/password/resetpassword/${uuid}`)

        res.status(201).json({success: true})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};


exports.resetPasswordURLHandling = async (req, res, next) => {
    try {
        const id = req.params.uuid;
        // console.log(id, "------------------------UUID");

        const data = await ForgotPasswordRequests.findByPk(id);
        // console.log(data,"########################")

        if (data.isActive === true) {
            // res.redirect('http://localhost:3000/reset_password/reset-password.html');
            res.redirect(url.format({
                pathname:"http://localhost:3000/reset_password/reset-password.html",
                query:{id}
              })
            );
            await data.update({isActive: false})
        }
        else{
            res.status(404).json({message: "This reset password URL is expired."})
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
    
};

exports.updatePassword = async (req, res, next) => {
    try{
        const updatePasswordReqId = req.body.id;
        // console.log(updatePasswordReqId);
        const password = req.body.password1;
        // console.log(password);

        const response = await ForgotPasswordRequests.findByPk(updatePasswordReqId, {
            include: [{
            model: User,
            attributes: ['password'] // You can specify which attributes of the associated model to include
            }]
        })
        // console.log(response.user.password, "123456==============================", response.isUpdated, "+++++++++++++++++++++++++++++++++++++++++")
        
        if (response.user.password && response.isUpdated === false) {
            // console.log("inside if000000000000000000000000000000000000000000")

            const salt = 10;
            const newPassword = await bcrypt.hash(password, salt);
            // console.log(newPassword);
            
            await User.update({ password: newPassword }, {where: {id: response.userId}});
            await response.update({ isUpdated: true });
            // await response.update({isUpdated: false})

            res.status(201).json({response: "User password successfully updatedted", message: "Password updated successfully"});
            return;
        }
        res.status(404).json({response: "User not found", message: "Session Expired"});

    }catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
};
