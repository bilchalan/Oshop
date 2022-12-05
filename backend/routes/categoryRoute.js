const express=require('express');
const { addCategory, getCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router=express.Router();
const {isAuthenticated,authorizeRoles}=require('../middleware/auth');


router.route('/categories')
        .post(isAuthenticated,authorizeRoles('admin'),addCategory)
        .get(getCategories);

router.route('/categories/:id')
        .get(getCategoryDetails)
        .put(isAuthenticated,authorizeRoles('admin'),updateCategory)
        .delete(isAuthenticated,authorizeRoles('admin'),deleteCategory);



module.exports=router;