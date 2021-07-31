const {Posts } = require("../models/mongomodels")

module.exports = {
    createPost: async (req, res) => {    
        let title = req.body.title;
        let body = req.body.body;
        const result = new Posts({ title: title,body:body,created_by:"pramod" });
        result.save().then((data) =>{
            return res.status(201).send({
                message : "Post created successfully!",
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
}
