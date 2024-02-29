// const { where } = require('sequelize');
const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.postAddUser = async (req, res, next) => {
    console.log(req.body);
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({error: 'All fields are not provided', msg: "All Fields are not filled"});
        }

        const existingUser = await User.findOne( {where: {
            email: email}
        });

        if (existingUser) {
            return res.status(400).json({error: 'User already exists with this email', msg: "User already exits with this email. Try login"})
        };

        const salt = 10;
        bcrypt.hash(password, salt, async (err, hash) => {
            if(err) {
                throw new Error('Something went wrong in password encryption')
            }
            await User.create({name, email, password: hash});
            res.status(201).json({response: "User successfully created", msg: "Signup successful"});
        })
        
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    };
};

function generateAccessToken(id, name) {
    return jwt.sign({userId: id, name: name}, "secretkey");
}

exports.userLoginAuth = async (req, res, next) => {
    console.log(req.body);
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({where: {
            email: email}
        });

        if (existingUser) {
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if(err) {
                    throw new Error('Something went wrong')
                }
                if(result) {
                    res.status(200).json({success: true, msg: "User login sucessful", token: generateAccessToken(existingUser.id, existingUser.name)});
                }
                else{
                    res.status(401).json({success: false, msg: "User password is incorrect"});
                }
            })
        }
        else{
            res.status(404).json({success: false, msg: "User not found"});
        };
        
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err})
    }
};