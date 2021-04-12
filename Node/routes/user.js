const express = require('express')
const router = express.Router()



const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const userController = require('../controllers/user')



/*router.get('/secret/:userId', requireSignin, (req, res) => {  //tartib mta3 les param mohim 5ater tabda mlawla wenta mashi
    res.json({
        user: req.profile
    });
});*/
router.get('/user/', userController.readAll)
router.get('/user/:userId', userController.read)
router.put('/user/update/:userId', userController.update)


router.param('userId', userController.userById)


module.exports = router;