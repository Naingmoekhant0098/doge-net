const router = require('express').Router();
const {searchPosts,createPost,getPosts,likePost,addComment,likeComment,addReply,getReply,getComment,likeReply,followUser} = require('../controllers/postController')
router.post('/createPost',createPost)
router.get('/getPosts',getPosts)
// router.put('/updateProfile',updateProfile)
router.put('/likePost',likePost)
router.put('/addComment',addComment)
router.put('/likeComment',likeComment)
router.put('/addReply',addReply)
router.get('/getReply',getReply)
router.get('/getComment',getComment)
router.put('/likeReply',likeReply)
router.put('/followUser' , followUser);
router.get('/searchPosts' , searchPosts);
module.exports = router;