const router = require('express').Router();
const {signUp,signIn} = require('../controllers/AuthController')
router.post('/sign-in',signIn)
router.post('/sign-up',signUp)
router.post('/google_auth')


module.exports = router;