const Store=require('../models/storeModel');
const Product=require('../models/productModel');
const ErrorHandler=require('../utils/errorHandler');
const asyncHandler=require('express-async-handler');
const {saveImages,removeFiles}=require('../utils/processImages');

exports.addStore=asyncHandler(async(req,res,next)=>{
    const {title,description,address,city,zipCode,state,country,email,phone}=req.body;
    console.log(req.userInfo);
    const addedBy=req.userInfo.userId;
    const location={address,city,zipCode,state,country}
    const data={title,description,location,email,phone,addedBy}

    const store=await Store.create(data);
    if(store){
        const path=`logo/${store._id}`
        const storeLogo=await saveImages(req.files,path);
        store.logo={url:storeLogo[0]}
        await store.save();
        res.status(201).json({success:true,store});
    }
})

exports.getStores=asyncHandler(async(req,res,next)=>{
    let stores=[];
    const {roles}=req.userInfo;
    if(roles==='seller' || roles.includes('seller')){
        const storeId=req.userInfo.storeId;
        const store=await Store.findById(storeId);
        stores.push(store);
    }else{
        stores=await Store.find();
    }
    res.status(200).json({success:true,stores});
})

exports.getStoreDetails=asyncHandler(async(req,res,next)=>{
    const {roles}=req.userInfo;
    let store;
    if(roles==='seller' || roles.includes('seller')){
        const storeId=req.userInfo.storeId;
        if(req.params.id !== storeId) return next(new ErrorHandler('Store not found',404));
        store=await Store.findById(storeId);
    }else{
        store=await Store.findById(req.params.id);
    }
    if(!store) return next(new ErrorHandler('Store not found',404));

    res.status(200).json({success:true,store});
})

exports.updateStore=asyncHandler(async(req,res,next)=>{
    const {title,description,address,city,zipCode,state,country,email,phone}=req.body;
    const updatedBy=req.userInfo.userId;
    const location={address,city,zipCode,state,country}
    const data={title,description,location,email,phone,updatedBy}

    const {roles}=req.userInfo;
    let store;
    if(roles==='seller' || roles.includes('seller')){
        const storeId=req.userInfo.storeId;
        if(req.params.id !== storeId) return next(new ErrorHandler('Store not found',404));
        store=await Store.findById(storeId);    
    }else{
        store=await Store.findById(req.params.id);
    }
    if(!store) return next(new ErrorHandler('Store not found',404));
    
    store=await Store.findByIdAndUpdate(req.params.id,data,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    
    if(store){
        if(req.files){
            const path=`logo/${store._id}`;
            const remove=removeFiles(path);
            if(remove){
                const storeLogo=await saveImages(req.files,path);
                store.logo={url:storeLogo[0]};
                await store.save();
            }else{
                return next(new ErrorHandler('Not procceded.',500));
            }
        }
    }
    res.status(201).json({success:true,store});

})

exports.deleteStore=asyncHandler(async(req,res,next)=>{
    let store=await Store.findById(req.params.id)
    if(!store) return next(new ErrorHandler('Store not found',404));

    const active=await Product.findOne({store:req.params.id});
    if(active) return next(new ErrorHandler('This store is used in product. Could not deleted',404));

    const path=`logo/${store._id}`;
    removeFiles(path);
    await store.remove();

    res.status(200).json({success:true,message:'Store deleted.'});
})



