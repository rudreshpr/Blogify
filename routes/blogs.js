const {Router} = require('express');
const multer = require("multer");
const path = require("path");
const blog = require("../models/blog");
const User = require("../models/user");
const comments = require("../models/comments");

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName);
    }
  })

  const upload = multer({ storage: storage })

router.get("/add-blog",(req,res)=>{
    return res.render("addBlogs",{
        user:req.user,
    })
})

router.post("/",upload.single("image"), async(req,res)=>{
    const {title, body} = req.body;
    const Blog = await blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${Blog._id}`);
})

router.get("/:id",async (req,res)=>{
 const Blog = await blog.findById(req.params.id).populate("createdBy");
 const userComments = await comments.find({blogId:req.params.id}).populate("createdBy");
 return res.render("blog",{
    user:req.user,
    Blog,
    userComments,
 })
});

router.post("/comment/:blogId",async(req,res)=>{
 await comments.create({
    comment:req.body.comment,
    createdBy:req.user._id,
    blogId:req.params.blogId
 })
 return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports=router;