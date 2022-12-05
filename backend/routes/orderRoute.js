const express=require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder } = require('../controllers/orderController');

const {isAuthenticated, authorizeRoles}=require('../middleware/auth');

const router=express.Router();


router.route('/orders')
        .post(isAuthenticated,newOrder)
        .get(isAuthenticated,myOrders);

router.route('/orders/:id')
        .get(isAuthenticated,getSingleOrder);

router.route('/authorized/orders')
        .get(isAuthenticated,authorizeRoles('admin'),getAllOrders);        

router.route('/authorized/orders/:id').delete(isAuthenticated,authorizeRoles('admin'),deleteOrder).put(isAuthenticated,authorizeRoles('admin'),updateOrder); 

module.exports=router;