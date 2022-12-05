const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please enter email.'],
        unique:true,
        validate:[validator.isEmail, 'Please enter a valid email.']
    },
    password:{
        type:String,
        required:[true,'Please enter password.'],
        minLength:[8,'Password should be more than 8 characters.'],
        select:false
    },
    avatar:{
        id:{type:String},
        url:{type:String}
    },
    roles:{
        type:[String],
        default:'user',
        required:true,
        enum:['admin','seller','user']
    },
    store:{
        type:mongoose.Schema.ObjectId,
        ref:"Store"
    },
    updatedBy:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    },
    refreshToken:[String],
    blocked:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword=async function(oldPassword){
    return await bcrypt.compare(oldPassword,this.password);
}

module.exports=mongoose.model("User",userSchema);