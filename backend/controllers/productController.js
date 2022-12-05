const Product =require('../models/productModel');
const Order=require('../models/orderModel');
const Errorhandler=require('../utils/errorHandler');
const asyncHandler=require('express-async-handler');
const {saveImages,removeFiles}=require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');

exports.addProduct=asyncHandler(async(req,res,next)=>{
    const {roles}=req.userInfo;
    req.body.addedBy=req.userInfo.userId;
    if(roles==='seller' || roles.includes('seller')){
        req.body.store=req.userInfo.storeId;
    }else{
        req.body.store=req.body.store;
    }
    let product=await Product.create(req.body);
    if(product){
        const path=`products/${req.body.store}/${product._id}`;
        const productImages=await saveImages(req.files,path);
        product.images=productImages.map((image)=>({url:image}));
        product=await product.save();
        res.status(201).json({success:true,product});
    }
})

exports.getProducts = asyncHandler(async (req, res, next) => {

    //product limit per page
    let resultPerPage;
    if(req.query.limit){
      resultPerPage=parseInt(req.query.limit);
    }else{
      resultPerPage = 8;
    }
  
      //sort by ratings
    let sortBy;
    if(req.query.sort_by_ratings){
      if(req.query.sort_by_ratings==='true'){
        sortBy={ratings:-1};
      }    
    }else{
      sortBy={};
    }
    //sort by product added time
    if(req.query.sort_by_oldest){
      if(req.query.sort_by_oldest==='true'){
        sortBy=Object.assign(sortBy,{createdAt:+1});
      }    
    }else{
      sortBy=Object.assign(sortBy,{createdAt:-1});
    }
  
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find().sort(sortBy), req.query)
                                              .search()
                                              .filter();

    const filteredApiFeature=new ApiFeatures(Product.find().sort(sortBy), req.query)
    .search()
    .filter();
  
    let filteredProduct=await filteredApiFeature.query;
    let filteredProductsCount = filteredProduct.length;
  
    apiFeature.pagination(resultPerPage);
    const products = await apiFeature.query;
    
    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      filteredProductsCount,
    });
  });

exports.getProductDetails = asyncHandler(async (req, res, next) => {
  const product=await Product.findById(req.params.id)
  .populate('store', 'id title')
  .populate('brand','id title')
  .populate('category','id title')
  .populate({path:'reviews',populate:({path:'user',select:'name avatar'})});

  if(!product) return next(new Errorhandler('Product not found',404));
  res.status(200).json({success:true,product});
})

  exports.getProductsByAuthorizeRoles = asyncHandler(async (req, res, next) => {
    const {roles}=req.userInfo;
    let storeId;
    let products;
    if(roles==='seller' || roles.includes('seller')){
      storeId=req.userInfo.storeId;
      products=await Product.find({store:storeId});
    }else{
      products=await Product.find();
    }

    res.status(200).json({success:true,products});
  })

  exports.updateProduct = asyncHandler(async (req, res, next) => {
    const {roles}=req.userInfo;
    req.body.updatedBy=req.userInfo.userId;

    let product;
    if(roles==='seller' || roles.includes('seller')){
      product=await Product.findOne({_id:req.params.id,store:req.userInfo.storeId});
      req.body.store=req.userInfo.storeId;
    }else{
      product=await Product.findById(req.params.id);
    }

    if(!product) return next(new ErrorHandler('Product not found',404));
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
      new:true,runValidators:true,useFindAndModify:false
    })
    if(product){
      if(req.files){
        const path=`products/${product.store}/${product._id}`;
        const remove=removeFiles(path);
        if(remove){
          const productImages=await saveImages(req.files,path);
          product.images=productImages.map((image)=>({url:image}));
          await product.save();
        }else{
          return next(new ErrorHandler('Not proccedded.',500));
        }        
      }
    }

    res.status(201).json({success:true,product});
  })

  exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product=await Product.findById(req.params.id)

    if(!product) return next(new Errorhandler('Product not found',404));
    const active=await Order.findOne({orderItems:{$elemMatch:{product:req.params.id}}});
    if(active) return next(new Errorhandler('Product is used in order. Could not deleted.',404));

    const path=`products/${product.store}/${product._id}`;
    const remove=removeFiles(path);
    if(remove){
      await product.remove();
      res.status(200).json({success:true,message:'Product deleted.'});
    }
    return next(new Errorhandler('Not procceded.',500));
  })
