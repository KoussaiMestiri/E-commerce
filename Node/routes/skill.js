const express = require('express')
const router = express.Router()

const skillController = require('../controllers/skill')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/skill/create/:userId", skillController.create)
router.delete("/skill/delete/:skillById/:userId", skillController.remove)
router.put("/skill/update/:skillById", skillController.update)
router.get("/skill/getAllSkill/:userId", skillController.readAll)



router.param('userId', userById)
router.param('skillById', skillController.skillById)




module.exports = router;