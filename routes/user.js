const {Router} = require('express');
const user = require("../models/user");
const router = Router();

router.get('/signin',(req,res)=>{
    res.render("signin");
})

router.get('/signup',(req,res)=>{
    res.render("signup");
})

router.post("/singin",async(req,res)=>{
    const {email, password}  = req.body;
    try{
        const token = await user.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/");
    }
    catch(error){
      return res.render('signin',{
        error:"Invalid Email or Password",
      });
    }
   
})

router.post("/singup",async(req,res)=>{
    const {fullName, email, password} = req.body;
    await user.create({
      fullName,
      email,
      password
    });
    return res.redirect("/");
})

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/");
})


module.exports=router;