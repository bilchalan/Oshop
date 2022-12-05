const express=require('express');
const fileUpload=require('express-fileupload');
const filesPayloadExists=require('../middleware/filesPayloadExists');
const fileExtLimiter=require('../middleware/fileExtLimiter');
const fileSizeLimiter=require('../middleware/fileSizeLimiter');

const { addProduct, getProducts, getProductDetails, getProductsByAuthorizeRoles, updateProduct, deleteProduct } = require('../controllers/productController');

const {isAuthenticated, authorizeRoles}=require('../middleware/auth');

const router=express.Router();


router.route('/products').post(isAuthenticated,
                authorizeRoles('admin','seller'),
                fileUpload({createParentPath:true}),
                filesPayloadExists,
                fileExtLimiter(['.png','.jpg','.jpeg']),
                fileSizeLimiter,addProduct).get(getProducts);

router.route('/products/:id').get(getProductDetails)
                                .put(isAuthenticated,
                                    authorizeRoles('admin','seller'),
                                    fileUpload({createParentPath:true}),
                                    fileExtLimiter(['.png','.jpg','.jpeg']),
                                    fileSizeLimiter,updateProduct).
                                delete(isAuthenticated,
                                    authorizeRoles('admin'),
                                    deleteProduct)

router.route('/athorized/products').get(isAuthenticated,authorizeRoles('admin','seller'),getProductsByAuthorizeRoles)


module.exports=router;