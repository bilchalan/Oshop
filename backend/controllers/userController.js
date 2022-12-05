const ErrorHandler=require('../utils/errorHandler');
const asyncHandler=require('express-async-handler');
const User=require('../models/userModel');
const Order=require('../models/orderModel');
const Product=require('../models/productModel');
const Store =require('../models/storeModel');
const {getAccessToken,getRefreshToken}=require('../utils/getTokens');
const {sendUser}=require('../utils/sendUser');
const jwt=require('jsonwebtoken');
const {saveImages,removeFiles}=require('../utils/processImages');

/* const cookieOption={httpOnly:true,secure:true,sameSite:'None',maxAge:24*60*60*1000}; */
const cookieOption={httpOnly:true};


exports.registerUser=asyncHandler(async(req,res,next)=>{
    
    const {email, name, password}=req.body;
    let user=await User.findOne({email}).exec();
    if(user) return next(new ErrorHandler('This email is already used. You can login or use other email to register.',409));
    user=await User.create({email,name,password});
    if(user){
        const path=`avatar/${user._id}`;        
        const userAvatar=await saveImages(req.files,path);
        user.avatar={url:userAvatar[0]};
        await user.save();
        res.status(201).json({success:true,user});
    }
})

exports.loginUser=asyncHandler(async(req,res,next)=>{
    const cookies=req.cookies;
    const {email, password}=req.body;
    if(!email || !password) return next(new ErrorHandler('Please enter email & password',400));
    let user=await User.findOne({email}).select('+password');
    if(!user)  return next(new ErrorHandler('Invalid email or password',404));
    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',404));
    }else{
        const accessToken=getAccessToken(user);
        const newRefreshToken=getRefreshToken(user);

        let newRefreshTokenArray=!cookies?.jwt?user.refreshToken:user.refreshToken.filter(rt=>rt !==cookies.jwt);

        if(cookies?.jwt){
            const refreshToken=cookies.jwt;
            const foundToken=await User.findOne({refreshToken}).exec();

            if(!foundToken){
                console.log('attempted refresh token reuse at login');
                newRefreshTokenArray=[];
            }

            res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
        }
        user.refreshToken=[...newRefreshTokenArray,newRefreshToken];
        await user.save();
        res.cookie('jwt',newRefreshToken,cookieOption);
        res.status(200).json({success:true,accessToken,user:sendUser(user)});
    }
})

exports.logout=asyncHandler(async(req,res,next)=>{
    const cookies=req.cookies;    
    if(!cookies?.jwt) return res.status(200).json({success:true,message:'Logged out'});
    const refreshToken=cookies.jwt;
    const user=await User.findOne({refreshToken}).exec();
    if(!user){
        res.clearCookie('jwt',{httpOnly:true});
        return res.status(200).json({success:true,message:'Logged out'});
    }
    user.refreshToken=user.refreshToken.filter(rt=>rt!==refreshToken);
    await user.save();

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
    res.status(200).json({success:true,message:'Logged out'});
})

exports.updatePassword=asyncHandler(async(req,res,next)=>{

    const {oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword) return next(new ErrorHandler('Please enter old & new password',400));

    const user=await User.findById(req.userInfo.userId).select('+password');
    const isPasswordMatched=await user.comparePassword(oldPassword);
    if(!isPasswordMatched) return next(new ErrorHandler('Old password is incorrect',400));

    user.password=newPassword;
    await user.save();

    res.status(200).json({success:true});
})

exports.updateProfile=asyncHandler(async(req,res,next)=>{
    const newUserData={name:req.body.name}

    let user= await User.findById(req.userInfo.userId);
    if(!user) return next(new ErrorHandler('User not found.',404));
    user=await User.findByIdAndUpdate(req.userInfo.userId,newUserData,{
        new:true,
        runValidators:true,
        useFindAndMdify:false
    })
    if(user){
        if(req.files){
            const path=`avatar/${user._id}`
            const remove=removeFiles(path);
            if(remove){
                const userImage=await saveImages(req.files,path);
                user.avatar={url:userImage[0]}
                await user.save();
            }else{
                return next(new ErrorHandler('Not procceded.Try again later.',500));
            }
        }
    }
    res.status(200).json({success:true,user:sendUser(user)});
})

exports.getUsers=asyncHandler(async(req, res, next)=>{
    const {userId}=req.userInfo;
    const users=await User.find({_id:{$ne:userId}}).select('-refreshToken');
    res.status(200).json({success:true,users});
})

exports.getUserDetails=asyncHandler(async(req, res, next)=>{
    const user=await User.findById(req.params.id).select('-refreshToken');
    if(!user) return next(new ErrorHandler('User does not exists.',404))
    res.status(200).json({success:true,user});
})

exports.updateUserRole=asyncHandler(async(req, res, next)=>{
    const {roles, store, blocked}=req.body;
    const {userId}=req.userInfo;
    if(roles==='seller' || roles.includes('seller')){
        
        if(!store) return next(new ErrorHandler('Please specify a store',400));
        if(!await Store.findById(store)) return next(new ErrorHandler('Store not found',404));
        await User.findByIdAndUpdate(req.params.id,{roles,store,updatedBy:userId,blocked},{
            new:true,runValidators:true,useFindAndMdify:false
        })
    }else{
        await User.findByIdAndUpdate(req.params.id,
            {
                roles,updatedBy:userId,blocked,$unset:{store:''}
            },
            {
                new:true,runValidators:true,useFindAndMdify:false
            }
            )
    }
    res.status(200).json({success:true});
})

exports.deleteUser=asyncHandler(async(req, res, next)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    if(!user) return next(new ErrorHandler('User not found',404));

    const activeOrder=await Order.findOne({user:id});
    if(activeOrder) return next(new ErrorHandler('User not deleted',400));

    const activeProduct=await Product.findOne({$or:[{addedBy:id},{updatedBy:id}]});
    if(activeProduct) return next(new ErrorHandler('User not deleted',400));

    const path=`avatar/${user._id}`;
    removeFiles(path);
    await user.remove();
    res.status(200).json({success:true,message:'User deleted.'});

})

exports.refreshToken=asyncHandler(async(req, res, next)=>{
    const cookies=req.cookies;

    if(!cookies?.jwt) return next(new ErrorHandler('Unauthorised',401));

    const refreshToken=cookies.jwt;
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});

    const user=await User.findOne({refreshToken});

    if(!user){
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async(err, decoded)=>{
                if(err) return next(new ErrorHandler('Forbidden',403));
                const hackedUser=await User.findOne({_id:decoded.userId}).exec();
                hackedUser.refreshToken=[];
                await hackedUser.save();
            })
            return next(new ErrorHandler('Forbidden',403));
    }
    const newRefreshTokenArray=user.refreshToken.filter(rt=>rt !==refreshToken);

    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async(err, decoded)=>{
            if(err) {
                user.refreshToken=[...newRefreshTokenArray];
                await user.save();
                return next(new ErrorHandler('Unauthorised',401));
            }
            if(err || user._id.toString() !== decoded.userId) return next(new ErrorHandler('Forbidden',403));

            const accessToken=getAccessToken(user);
            const newRefreshToken=getRefreshToken(user);
            user.refreshToken=[...newRefreshTokenArray,newRefreshToken];
            await user.save();

            res.cookie('jwt',newRefreshToken,cookieOption);
            res.status(200).json({success:true,accessToken,user:sendUser(user)});

        })
})
