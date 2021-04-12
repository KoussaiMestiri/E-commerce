const Certification = require('../models/Certification')
const User = require('../models/User')
const {errorHandler} = require('../helpers/dbErrorHandlers')




exports.certificationById = (req, res, next, id) => {
    Certification.findById(id).exec((err, certification) => {
        if(err || !certification) {
            return res.status(400).json({
                error: "No Education"
            });
        }
        req.certification = certification;
        req.certificationById = certification._id
        next();
    });
};

exports.create = (req, res) => {
    const certification = new Certification(req.body)
    certification.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        User.findOneAndUpdate({_id: req.userId}, {$push: {"profile.certification": data._id}}, {new: true}, (err, user) => {
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
    let certification = req.certification
    User.updateOne({_id: req.userId}, {$pull: {"profile.certification": certification._id}},(err, user) => {
        if(err) {
            res.status(400).jso({
                error: "Error"
            })
        }
    });
    certification.remove((err, deletedCertification) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Certification Was Deleted Succussfully"
        })
    })
}

exports.update = (req, res) => {
    Certification.findOneAndUpdate({_id: req.certificationById}, {$set: req.body}, {new: true}, (err, certification) => {
        if(err) {
            return res.status(400).json({
                error: "Error"
            });
        }
        res.json(certification)
    });
};

exports.readAll = (req,res) => {
    User.find({_id: req.userId}).select("profile.certification").populate("profile.certification").exec((err, certifications) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(certifications);
    })
}