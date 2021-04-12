const express = require('express')
const router = express.Router()

const educationController = require('../controllers/education')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/education/create/:userId", educationController.create)
router.delete("/education/delete/:educationById/:userId", educationController.remove)
router.put("/education/update/:educationById", educationController.update)
router.get("/education/getAlleducation/:userId", educationController.readAll)



router.param('userId', userById)
router.param('educationById', educationController.educationById)




module.exports = router;