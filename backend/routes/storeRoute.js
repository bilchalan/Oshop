const express=require('express');
const fileUpload=require('express-fileupload');
const filesPayloadExists=require('../middleware/filesPayloadExists');
const fileExtLimiter=require('../middleware/fileExtLimiter');
const fileSizeLimiter=require('../middleware/fileSizeLimiter');
const {isAuthenticated, authorizeRoles}=require('../middleware/auth');
const { addStore, getStores, getStoreDetails, updateStore, deleteStore } = require('../controllers/storeController');

const router=express.Router();

router.route('/stores').post(isAuthenticated,
                            authorizeRoles('admin'),
                            fileUpload({createParentPath:true}),
                            filesPayloadExists,
                            fileExtLimiter(['.png','.jpg','.jpeg']),
                            fileSizeLimiter,
                            addStore)
                        .get(isAuthenticated,
                            authorizeRoles('admin','seller'),
                            getStores);

router.route('/stores/:id').get(isAuthenticated,
                                authorizeRoles('admin','seller'),
                                getStoreDetails)
                            .put(isAuthenticated,
                                authorizeRoles('admin','seller'),
                                fileUpload({createParentPath:true}),
                                fileExtLimiter(['.png','.jpg','.jpeg']),
                                fileSizeLimiter,
                                updateStore)
                            .delete(isAuthenticated,
                                authorizeRoles('admin'),
                                deleteStore)



module.exports=router;