const express = require('express')
const router = express.Router()

const {create, categoryById, read, update, remove, readAll} = require('../controllers/category')
const {userSignupValidator} = require('../validator/index')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/category/create/:userId", create)
router.get("/category/getCategory/:categoryId/:userId", read)
router.put("/category/updateCategory/:categoryId/:userId", update)
router.delete("/category/deleteCategory/:categoryId/:userId", remove)
router.get("/category/getAllCategory/:userId", readAll)


router.param('userId', userById)
router.param('categoryId', categoryById)




module.exports = router;