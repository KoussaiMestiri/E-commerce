const express = require('express')
const router = express.Router()

const {signup, signin, signout, requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require('../validator/index')

router.post("/signup", userSignupValidator, signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.get("/home", requireSignin, (req, res) =>{
    res.send('Hello');
})



module.exports = router;