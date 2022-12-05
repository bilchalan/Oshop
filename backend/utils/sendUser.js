exports.sendUser=(userModel)=>{
    const user={
        name:userModel.name,
        avatar:{url:userModel.avatar.url},
        createdAt:userModel.createdAt,
        updatedAt:userModel.updatedAt
    }

    return user;
}