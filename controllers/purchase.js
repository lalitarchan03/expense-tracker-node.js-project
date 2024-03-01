const { json } = require('body-parser');
const Order = require('../models/order');
const User = require('../models/user');

const Razorpay = require('razorpay');

exports.purchasePremium = async (req, res, next) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount = 2000;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            Order.create({orderId: order.id, status: 'PENDING', userId: req.user.id})
            .then(() => {
                res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    }
};


exports.updateTransactionStatus = async (req, res, next) => {
    try{
        // const {paymentId, orderId} = req.body;
        // Order.findOne({where: {orderId: orderId}})
        //     .then(order => {order.update({paymentId: paymentId, status: 'SUCCESSFUL'})
        //         .then(()=> {req.user.update({isPremiumUser: true})
        //             .then(()=>{
        //                 res.status(202).json({success: true, message: 'Transaction Successful'});
        //             })
        //             .catch(err => {
        //                 throw new Error(err);
        //             })
        //         })
        //         .catch(err => {
        //             throw new Error(err);
        //         })
        //     })
        //     .catch(err => {
        //         throw new Error(err);
        //     })
        const { paymentId, orderId } = req.body;

        const order = await Order.findOne({ where: { orderId: orderId } });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await order.update({ paymentId: paymentId, status: 'SUCCESSFUL' });

        await req.user.update({ isPremiumUser: true });

        res.status(202).json({ success: true, message: 'Transaction Successful' });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    };
};