const express = require('express')
const router = express.Router()



const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')



router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {  //tartib mta3 les param mohim 5ater tabda mlawla wenta mashi
    res.json({
        user: req.profile
    });
});

router.param('userId', userById)


module.exports = router;