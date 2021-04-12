const { errorHandler } = require('../helpers/dbErrorHandlers')
const Category = require('../models/Category')


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                error: "Category Doesn't Exist"
            });
        }
        req.category = category;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.category);  
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({data})
    })
}

exports.update = (req,res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    });
};

exports.remove = (req,res) => {
    const category = req.category
    category.name = req.body.name
    category.remove((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message:"Category Deleted Successfully"
        })
    });
}

exports.readAll = (req,res) => {
    Category.find().exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    })
}