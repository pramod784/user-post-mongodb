const { Users } = require("../../models/mongomodels") 
require("dotenv/config");
const md5 = require("md5")
const jwt = require("jsonwebtoken")

module.exports = {
    registerUser: async (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let role = req.body.role;
        console.log(req.body)
        
        let insert_obj = { name:name,email:email,password:md5(password),role:role }
        let result = new Users(insert_obj);
        result.save().then((data) =>{
            console.log('User Registered successfully!',data)
            return res.status(201).send({
                message : "User Registered successfully!",
                status:true
            })
        }).catch(e=>{
            console.log("register user error ",e)
            return res.status(501).send({
                message : "Error occured! Please try again!",
                status:false
            })
        });
    },
    loginUser:async(req,res)=>{
        let email = req.body.email;
        let password = req.body.password;
        Users.findOne({ email : email }, function(err, user) {
            if (user === null) {
                return res.status(400).send({
                    message : "User not found.",
                    status:false
                });
            }
            else {
                if (md5(password)== user.password) {                   
                    var token = jwt.sign({ email: user.email,userId: user._id },process.env.JWT_SECRETE,{ expiresIn: '1h' });
                    return res.status(201).send({
                        message : "User Logged In",
                        token:token,
                        status:true
                    })
                }
                else {
                    return res.status(400).send({
                        message : "Wrong Password",
                        status:false
                    });
                }
            }
        });
    }
}