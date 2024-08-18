const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
comment:{
    type:String,
    required:true,
},
blogId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"blogs"
},
createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
}
},{timestamps:true})

const comments = mongoose.model('comment', commentSchema);
module.exports = comments;