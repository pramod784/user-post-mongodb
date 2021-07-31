const { Users } = require("../../models/mongomodels") 
require("dotenv/config");
const md5 = require("md5")
const jwt = require("jsonwebtoken")
var validator = require('validator');

module.exports = {
    registerUser: async (req, res) => {
        if(!req.body.hasOwnProperty('name') || validator.isEmpty(req.body.name) || req.body.name === undefined || req.body.name.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Post id mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('email') || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email) || req.body.email === undefined || req.body.email.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Email id mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('password') || validator.isEmpty(req.body.password) || req.body.password === undefined || req.body.password.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Password id mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('role') || validator.isEmpty(req.body.role) || req.body.role === undefined || req.body.role.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Role id mandatory!"
            });
        }
        
        let name = req.body.name.trim();
        let email = req.body.email.trim();
        let password = req.body.password.trim();
        let role = req.body.role.trim();
        if(role != "admin" && role != "student")
        {
            return res.status(403).send({
                status: false,
                message: "Role must be admin or student only!"
            });
        }

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
        if(!req.body.hasOwnProperty('email') || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email) || req.body.email === undefined || req.body.email.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Email id mandatory!"
            });
        }
        if(!req.body.hasOwnProperty('password') || validator.isEmpty(req.body.password) || req.body.password === undefined || req.body.password.trim()=="")
        {
            return res.status(403).send({
                status: false,
                message: "Password id mandatory!"
            });
        }
        let email = req.body.email.trim();
        let password = req.body.password.trim();
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