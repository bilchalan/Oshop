const jwt=require('jsonwebtoken');

exports.getAccessToken=(user)=>{
    let userInfo;
    if(user.store){
        userInfo=
        {
            'UserInfo':{
                'userId':user._id,
                'roles':user.roles,
                'email':user.email,
                'storeId':user.store
            }
        }
    }else{
        userInfo=
        {
            'UserInfo':{
                'userId':user._id,
                'roles':user.roles,
                'email':user.email
            }
        }
    }
    const accessToken=jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_SECRET_EXPIRE});

    return accessToken;

}

exports.getRefreshToken=(user)=>{
    const refreshToken=jwt.sign(
        {'userId':user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET_EXPIRE
        }
    )
    return refreshToken;
}