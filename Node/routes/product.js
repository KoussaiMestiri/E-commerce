const express = require('express')
const router = express.Router()

const {photo, create, read, productById, remove, update, allProducts, allRelatedProducts, listCategories, listBySearch} = require('../controllers/product')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {userById} = require('../controllers/user')

router.get('/product/:productId', read)
router.post("/product/create/:userId",requireSignin, isAuth, isAdmin, create)
router.delete('/product/:productId/:userId',requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId',requireSignin, isAuth, isAdmin, update)
router.get('/products', allProducts)
router.get('/products/related/:productId', allRelatedProducts)
router.get('/products/categories', listCategories)
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo)


router.param('userId', userById)
router.param('productId', productById)



module.exports = router;