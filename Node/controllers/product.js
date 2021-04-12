const Product = require('../models/Product')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')
const {errorHandler} = require('../helpers/dbErrorHandlers')
const product = require('../models/Product')
const { result } = require('lodash')



exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Product Not Found"
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    // hna idha kan ta3l load ll photo direct tnajem trazen l app so lazem na3mlo seperate request bash na3mlo load
    req.product.photo = undefined
    return res.json(req.product);  
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image Could Not Be Uploaded"
            })
        }
        const {name, description, price, category, quantity, shipping} = fields
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All Fields Are Required"
            })
        }

        let product = new Product(fields)
        
        if(files.photo) {
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image Should be Less Than 1MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
        })
    })
}

exports.remove = (req, res) => {
    let Product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product Was Deleted Succussfully"
        })
    })
}

//update najem nchof exemple sadio mane hadika asshel 
exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image Could Not Be Uploaded"
            })
        }
        const {name, description, price, category, quantity, shipping} = fields
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All Fields Are Required"
            })
        }

        let product = req.product;
        product = _.extend(product, fields);
        
        if(files.photo) {
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image Should be Less Than 1MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
        })
    })
};

 /**
  * We will Send Some queries to do somethings:
  *  We Will Send to the React App The Most Selled Products
  * most soled : /products?sortBy=sold&order=desc&limit=4 : this query feth the most 4th sold products and return them by desc order
  * arrival : /products?sortBy=createdAt&order=desc&limit=4
    if no params were sent, then all products are returned
  */


  exports.allProducts = (req, res) => {
      //default will take these params query 
    let order = req.query.order ? req.query.order: 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
    let limit = req.query.limit ? parseInt(req.query.limit): 4

    //we use select to deselect photo from getting the photo with response because it may be too heavy
    Product.find()
    .select("-photo")  //kif nzido - ya3ni exclude that attribut / c nn kif t7ot 3adi hadhokom les attrs ili njibohom
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: "Products Not Found"
            });
        };
        res.json(products);
    });
  };

  /**
   * it will find the products based on the req product category 
   * other products that has the same category 
   */

exports.allRelatedProducts = (req, res) => {
    //defaulat params of the request
    let limit = req.query.limit ? parseInt(req.query.limit): 4
    //ne : means not included we used to search for the product by the id and we don't want toinclude the req.product
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name') // second argument nesta3mloh bash just ya33tina l field hadhka barka ya3ni 7ashetna kan bl -id wel name
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: "Products Not Found"
            });
        }
        res.json(products);
    })
}

exports.listCategories = (req, res) => {
    // 2nnd paramaeter is the queries that we want to pass
    Product.distinct('category', {}, (err, product) => {
        if(err) {
            res.status(400).json({
                error: "Categories Not Found"
            });
        }
        res.json(product)
    })
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 4;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req, res) => {
    if( req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}