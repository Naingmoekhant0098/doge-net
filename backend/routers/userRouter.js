const router = require('express').Router();
const {savePost,getNotifications,updateNotification,getUsers,getUser,updateProfile} = require('../controllers/userController')
router.get('/getUser',getUser)
router.put('/updateProfile',updateProfile)
router.get('/getAllUser' , getUsers)
router.put('/updateNotification',updateNotification);
router.get('/getNotifications/:id' , getNotifications)
router.put('/savePost',savePost);
module.exports = router;