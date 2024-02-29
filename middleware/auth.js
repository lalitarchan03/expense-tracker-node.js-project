const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.authenticate = (req, res, next) => {

    try{
        const token = req.header('Authorization');
        // console.log(token);
        const tokenPayload = jwt.verify(token, 'secretkey');
        console.log(tokenPayload.userId, "token");
        User.findByPk(tokenPayload.userId).then(user => {
            req.user = user;
            next();
        })
    }
    catch(err) {
        console.log(err);
        return res.status(401).json({success: false});
    }
}