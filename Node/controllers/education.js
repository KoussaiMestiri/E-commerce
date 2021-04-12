const Education = require('../models/Education')
const User = require('../models/User')
const {errorHandler} = require('../helpers/dbErrorHandlers')




exports.educationById = (req, res, next, id) => {
    Education.findById(id).exec((err, edcuation) => {
        if(err || !education) {
            return res.status(400).json({
                error: "No Education"
            });
        }
        req.education = education;
        req.educationById = education._id
        next();
    });
};

exports.create = (req, res) => {
    const education = new Education(req.body)
    education.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        User.findOneAndUpdate({_id: req.userId}, {$push: {"profile.education": data._id}}, {new: true}, (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "Something Went Wrong"
                });
            }
        });
        res.status(201).json({data})
    })
}

exports.remove = (req, res) => {
    let education = req.education
    User.updateOne({_id: req.userId}, {$pull: {"profile.education": education._id}},(err, user) => {
        if(err) {
            res.status(400).jso({
                error: "Error"
            })
        }
    });
    education.remove((err, deletedEducation) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Education Was Deleted Succussfully"
        })
    })
}

exports.update = (req, res) => {
    Education.findOneAndUpdate({_id: req.educationById}, {$set: req.body}, {new: true}, (err, education) => {
        if(err) {
            return res.status(400).json({
                error: "Error"
            });
        }
        res.json(education)
    });
};

exports.readAll = (req,res) => {
    User.find({_id: req.userId}).select("profile.education").populate("profile.education").exec((err, educations) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(educations);
    })
}