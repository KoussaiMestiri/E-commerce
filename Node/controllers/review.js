const { errorHandler } = require('../helpers/dbErrorHandlers')
const Review = require('../models/Review');
const User = require('../models/User')



exports.reviewById = (req, res, next, id) => {
    Review.findById(id).exec((err, review) => {
        if(err || !review) {
            return res.status(400).json({
                error: "No Review"
            });
        }
        req.review = review;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.review);  
}

exports.create = (req, res) => {
    const review = new Review(req.body)
    review.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        if(data.reviewedBy.toString() == data.reviewedTo.toString()) {
            return res.status(400).json({
                error: "You Can't review Yourself"
            })
        }
        User.findOneAndUpdate({_id: data.reviewedTo}, {$push: {"profile.review": data._id}}, {new: true}, (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "Something Went Wrong"
                });
            }
        });
        res.status(201).json({data})
    })
}

exports.update = (req,res) => {
    const review = req.review
    review.name = req.body.name
    review.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.status(200).json(result);
    });
};

exports.remove = (req,res) => {
    const review = req.review
    review.name = req.body.name
    review.remove((err, result) => {
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
    Review.find().exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.status(201).json(result);
    })
}