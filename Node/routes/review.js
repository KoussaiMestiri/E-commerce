const express = require('express')
const router = express.Router()

const {create, reviewById, read, update, remove, readAll} = require('../controllers/review')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/review/create", create)
router.get("/review/getReview/:reviewById/:userId", read)
router.put("/review/updateReview/:reviewById/:userId", update)
router.get("/review/getAllReviews/:userId", readAll)


router.param('userId', userById)
router.param('reviewById', reviewById)




module.exports = router;