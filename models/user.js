const mongoose = require('mongoose');
const {createHmac } = require('crypto');
const crypto = require('crypto');
const { createUserToken } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    profileImage:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }

},{timestamps:true});

userSchema.pre('save',function (next){
const user = this;
if(!user.isModified("password")) return;

const salt = crypto.randomBytes(16).toString();
const hasedPassword = createHmac("sha256",salt)
.update(user.password)
.digest("hex");
this.salt=salt;
this.password=hasedPassword;
next();
})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
  const user = await this.findOne({email})
  if(!user)  throw new Error("User not found!!.."); 

  const salt = user.salt;
  const hasedPassword= user.password;
  const userProvidedHasedPassword = createHmac("sha256",salt)
  .update(password)
  .digest("hex");
 
  if(hasedPassword !==userProvidedHasedPassword) throw new Error("Invalid Email or Password");
   const token = createUserToken(user);
   return token;
})

const user = mongoose.model('users', userSchema);
module.exports = user;
