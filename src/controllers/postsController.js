const {Posts,Users,Cities } = require("../models/mongomodels")
const fs = require("fs");
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
        /* const result = new Posts({ title: title,body:body,created_by:userId });
        result.save().then((data) =>{ */
        Posts.create({ title: title,body:body,created_by:userId }).then((data) =>{
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
        let page_no = req.body.page_no == undefined || req.body.page_no < 1 ? 1 : req.body.page_no;
        let limit = 10;
        let offset = (page_no - 1) * limit;
        /* let post_data = await Posts.find().select(['_id','title','body','created_by','created_at']).skip(offset).limit(limit)
        .then(async(data_result) =>{
            let all_admin_users = await Users.find({role:"admin"}).select(['_id','name']);
            //console.log("=====================>>>>>>> all_admin_users ",all_admin_users)
            //console.log("=====================>>>>>>> data_result ",data_result)
            let final_res = []
            data_result.map((out_res)=>{
                for (let index = 0; index < all_admin_users.length; index++) {
                    const data = all_admin_users[index];
                    if(data._id == out_res.created_by)
                    {
                        let mydata = JSON.parse(JSON.stringify(out_res));
                        mydata.created_by_name = data.name;
                        out_res = mydata;
                    }
                }
                final_res.push(out_res);
            });
            return final_res;
        }).catch(e=>{
            console.log("error occured ",e)
            return []
        }); */
        
        /* let post_data = await Posts.aggregate([{
            $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "created_by",
                    as: "created_by_name"
                }
        }]); */
        
        let post_data = await Posts.aggregate([
            {
              "$project": {
                "_id": {
                  "$toString": "$_id"
                },
                "title":{
                    "$toString": "$title"
                },
                "body":{
                    "$toString": "$body"
                },
              }
            },
            {
              "$lookup": {
                "from": "users",
                "localField": "created_by",
                "foreignField": "_id",
                "as": "created_by_name"
              }
            }
        ]);
        
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
    },
    saveCities:async(req,res)=>{
        fs.readFile("./cities.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(403).send({
                message : "Unable to read file!",
                status:false
            })
        }else{
            let new_data = JSON.parse(jsonString);
            //let new_data = jsonString;
            Cities.insertMany(new_data).then(function(data){
                console.log("Data inserted")  // Success
                return res.status(201).send({
                    message : "Cities saved successfully!",
                    result:data,
                    status:true
                })
            }).catch(function(error){
                console.log(error)      // Failure
                return res.status(501).send({
                    message : "Error occured! Please try again!",
                    result:error,
                    status:false
                })
            });
        }
        });
    }
}
