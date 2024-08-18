const express = require('express');
const path = require('path');
const UserRouter = require('./routes/user')
const BlogsRouter = require('./routes/blogs')
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blogs = require("./models/blog");
const { checkForAuthenticationCookies } = require('./middleware/authentication');

const app = express();
const PORT =8000;
app.set('view engine','ejs');
app.set('views',path.resolve("./views"));
mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then((e)=>{console.log("MongoDB Connected")});
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"))
app.use(express.static(path.resolve("./public")));

app.get('/',async(req,res)=>{
   const allBlogs = await blogs.find({});
    res.render('home',{
        user:req.user,
        blogs : allBlogs,
    })
})
app.use("/user",UserRouter);
app.use("/blog",BlogsRouter);

app.listen(PORT,()=>{console.log(`Server Started on ${PORT}`)});