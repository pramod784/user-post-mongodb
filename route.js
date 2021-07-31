const express = require('express'); 
const router = express.Router();
const {apiAuthController,postsController} = require("./src/controllers")
var checkAuth = require("./src/middleware/checkAuth");

router.get("/",(req,res)=>{
    res.send("Welcome!")
})
router.post("/register",apiAuthController.registerUser)
router.post("/login",apiAuthController.loginUser)
router.post("/post",checkAuth,postsController.createPost)
router.get("/post/:postid",checkAuth,postsController.readPost)
router.get("/post",checkAuth,postsController.getPostsList)
router.patch("/post/:postid",checkAuth,postsController.updatePost)
router.delete("/post/:postid",checkAuth,postsController.deletePost)
module.exports = router