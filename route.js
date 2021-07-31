const express = require('express'); 
const router = express.Router();
const {apiAuthController,postsController} = require("./src/controllers")

router.get("/",(req,res)=>{
    res.send("Welcome!")
})
router.post("/register",apiAuthController.registerUser)
router.post("/login",apiAuthController.loginUser)
router.post("/post",postsController.createPost)
router.get("/post/:postid",postsController.readPost)
router.get("/post",postsController.getPostsList)
router.patch("/post/:postid",postsController.updatePost)
router.delete("/post/:postid",postsController.deletePost)

module.exports = router