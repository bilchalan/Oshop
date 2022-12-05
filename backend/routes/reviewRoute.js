const express=require('express');
const { createProductReview, getProductReviews, deleteProductReview } = require('../controllers/reviewController');
const {isAuthenticated, authorizeRoles}=require('../middleware/auth');

const router=express.Router();

router.route('/reviews')
        .put(isAuthenticated,createProductReview).get(getProductReviews)
        .delete(isAuthenticated,authorizeRoles('admin'),deleteProductReview);

module.exports=router;