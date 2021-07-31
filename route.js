const express = require('express'); 
const router = express.Router();
const {apiAuthController,postsController} = require("./src/controllers")

router.get("/",(req,res)=>{
    res.send("Welcome!")
})
router.post("/register",apiAuthController.registerUser)
router.post("/login",apiAuthController.loginUser)
router.post("/create/post",postsController.createPost)

module.exports = router