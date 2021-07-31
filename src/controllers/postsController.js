const {Posts } = require("../models/mongomodels")
module.exports = {
    createPost: async (req, res) => {    
        let title = req.body.title;
        let body = req.body.body;
        let userId = req.headers.userId;
        const result = new Posts({ title: title,body:body,created_by:userId });
        result.save().then((data) =>{
            return res.status(201).send({
                message : "Post created successfully!",
                result:data,
                status:true
            })
        }).catch(e=>{
            console.log("Create post error ",e)
            return res.status(501).send({
                message : "Error occured! Please try again!",
                status:false
            })
        });
    },
    readPost:async(req,res)=>{
        let post_id = req.params.postid;
        let post_data = await Posts.findById(post_id).select(['_id','title','body','created_by','created_at']);
        if(post_data)
        {
            return res.status(200).send({
                message : "Post retrieved successfully!",
                result:post_data,
                status:true
            })            
        }else
        {
            return res.status(400).send({
                message : "No post available with this id!",
                status:true
            })
        }
    },
    getPostsList:async(req,res)=>{
        /* var perPage = 10
        var page = Math.max(0, req.params.page)
        console.log("-------------",page); */
        let post_data = await Posts.find().select(['_id','title','body','created_by','created_at']);

        if(post_data)
        {
            return res.status(200).send({
                message : "Post list retrieved successfully!",
                result:post_data,
                status:true
            })            
        }else
        {
            return res.status(400).send({
                message : "No post available!",
                status:true
            })
        }
    },
    updatePost:async(req,res)=>{
        let title = req.body.title;
        let body = req.body.body;
        let post_id = req.params.postid;
        let update_obj = {
            title:title,
            body:body
        }
        let updated = await Posts.findByIdAndUpdate(post_id,update_obj);
        if(updated)
        {
            return res.status(200).send({
                message : "Post updated successfully!",
                status:true
            })            
        }else
        {
            return res.status(400).send({
                message : "No post available with this id!",
                status:true
            })
        }
    },
    deletePost:async(req,res)=>{
        let post_id = req.params.postid;
        let deleted = await Posts.findByIdAndDelete(post_id);
        if(deleted)
        {
            return res.status(200).send({
                message : "Post deleted successfully!",
                status:true
            })            
        }else
        {
            return res.status(400).send({
                message : "No post available with this id!",
                status:true
            })
        }
    }
}
