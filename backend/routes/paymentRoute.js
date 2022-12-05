const express=require('express');
const { processPayment, sendStripePublishableKey } = require('../controllers/paymentController');
const {isAuthenticated, authorizeRoles}=require('../middleware/auth');

const router=express.Router();
router.route('/create-payment-intent').post(isAuthenticated,processPayment)
router.route('/publishable-key').get(sendStripePublishableKey)

module.exports=router;