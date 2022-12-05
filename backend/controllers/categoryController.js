const Category=require('../models/categoryModel');
const ErrorHandler=require('../utils/errorHandler');
const asyncHandler=require('express-async-handler');
const Product=require('../models/productModel');


exports.addCategory=asyncHandler(async(req,res,next)=>{
    req.body.addedBy=req.userInfo.userId;
    const category=await Category.create(req.body);
    res.status(201).json({success:true,category});
})

exports.getCategories=asyncHandler(async(req,res,next)=>{
    const categories=await Category.find();
    res.status(200).json({success:true,categories});
})

exports.getCategoryDetails=asyncHandler(async(req,res,next)=>{
    const category=await Category.findById(req.params.id);
    if(!category) return next(new ErrorHandler('Category not found.',404))
    res.status(200).json({success:true,category});
})

exports.updateCategory=asyncHandler(async(req,res,next)=>{
    req.body.updatedBy=req.userInfo.userId;
    let category=await Category.findById(req.params.id);
    if(!category) return next(new ErrorHandler('Category not found.',404))
    category=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(201).json({success:true,category});
});

exports.deleteCategory=asyncHandler(async(req,res,next)=>{
    let category=await Category.findById(req.params.id);
    if(!category) return next(new ErrorHandler('Category not found.',404))
    const active=await Product.findOne({category:req.params.id});
    if(active) return next(new ErrorHandler('Category is used.Could not deleted.',406));
    await category.remove();
    res.status(200).json({success:true});
});

