const express = require('express')
const router = express.Router()

const {create, read, productById, remove, update, allProducts} = require('../controllers/product')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')

router.get('/product/:productId', read)
router.post("/product/create/:userId",requireSignin, isAuth, isAdmin, create)
router.delete('/product/:productId/:userId',requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId',requireSignin, isAuth, isAdmin, update)
router.get('/products', allProducts)



router.param('userId', userById)
router.param('productId', productById)



module.exports = router;