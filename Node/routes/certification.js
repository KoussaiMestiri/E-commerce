const express = require('express')
const router = express.Router()

const certificationController = require('../controllers/certification')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/certification/create/:userId", certificationController.create)
router.delete("/certification/delete/:certificationById/:userId", certificationController.remove)
router.put("/certification/update/:certificationById", certificationController.update)
router.get("/certification/getAllCertifications/:userId", certificationController.readAll)



router.param('userId', userById)
router.param('certificationById', certificationController.certificationById)




module.exports = router;