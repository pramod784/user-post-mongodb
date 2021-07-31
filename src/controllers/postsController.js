const {Posts } = require("../models/mongomodels")
var validator = require('validator');
module.exports = {
    createPost: async (req, res) => {    
        if(!req.body.hasOwnProperty('title') || validator.isEmpty(req.body.title) || req.body.title === undefined || req.body.title.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Title is mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('body') || validator.isEmpty(req.body.body) || req.body.body === undefined || req.body.body.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Body is mandatory!"
            });
        }
        if(!validator.isLength(req.body.body,1, 255))
        {
            return res.status(403).send({
                status: false,
                message: "Body length should be less than 255!"
            });
        }
        let title = req.body.title.trim();
        let body = req.body.body.trim();
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
        if(!req.params.hasOwnProperty('postid') || validator.isEmpty(req.params.postid) || req.params.postid === undefined || req.params.postid.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Post id mandatory!"
            });
        }
        let post_id = req.params.postid.trim();
        
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
        if(post_data && post_data.length > 0)
        {
            return res.status(200).send({
                message : "Post list retrieved successfully!",
                result:post_data,
                status:true
            })            
        }else
        {
            return res.status(400).send({
                message : "No posts available!",
                status:true
            })
        }
    },
    updatePost:async(req,res)=>{
        if(!req.params.hasOwnProperty('postid') || validator.isEmpty(req.params.postid) || req.params.postid === undefined || req.params.postid.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Post id mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('title') || validator.isEmpty(req.body.title) || req.body.title === undefined || req.body.title.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Title is mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('body') || validator.isEmpty(req.body.body) || req.body.body === undefined || req.body.body.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Body is mandatory!"
            });
        }
        if(!validator.isLength(req.body.body,1, 255))
        {
            return res.status(403).send({
                status: false,
                message: "Body length should be less than 255!"
            });
        }
        let post_id = req.params.postid.trim();
        let title = req.body.title.trim();
        let body = req.body.body.trim();

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
        if(!req.params.hasOwnProperty('postid') || validator.isEmpty(req.params.postid) || req.params.postid === undefined || req.params.postid.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Post id mandatory!"
            });
        }
        let post_id = req.params.postid.trim();
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
