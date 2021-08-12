const express = require('express'); 
const router = express.Router();
const {apiAuthController,postsController} = require("./src/controllers")
var {checkAuth,checkAdminAuth} = require("./src/middleware");

router.get("/",(req,res)=>{
    res.send("Welcome!")
})
router.post("/register",apiAuthController.registerUser)
router.post("/login",apiAuthController.loginUser)
router.post("/post",checkAdminAuth,postsController.createPost)
router.get("/post/:postid",checkAuth,postsController.readPost)
router.post("/post/list",checkAuth,postsController.getPostsList)
router.patch("/post/:postid",checkAdminAuth,postsController.updatePost)
router.delete("/post/:postid",checkAdminAuth,postsController.deletePost)

router.get("/save/city",postsController.saveCities)
module.exports = router