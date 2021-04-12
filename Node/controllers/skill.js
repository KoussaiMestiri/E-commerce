const Skill = require('../models/Skill')
const User = require('../models/User')
const {errorHandler} = require('../helpers/dbErrorHandlers')




exports.skillById = (req, res, next, id) => {
    Skill.findById(id).exec((err, skill) => {
        if(err || !skill) {
            return res.status(400).json({
                error: "No Skill"
            });
        }
        req.skill = skill;
        req.skillById = skill._id
        next();
    });
};

exports.create = (req, res) => {
    const skill = new Skill(req.body)
    skill.save((err, data) => {
        if(err || !data){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        User.findOneAndUpdate({_id: req.userId}, {$push: {"profile.skills": data._id}}, {new: true}, (err, user) => {
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
    let skill = req.skill
    User.updateOne({_id: req.userId}, {$pull: {"profile.skills": skill._id}},(err, user) => {
        if(err) {
            res.status(400).jso({
                error: "Error"
            })
        }
    });
    skill.remove((err, deletedSkill) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Skill Was Deleted Succussfully"
        })
    })
}

exports.update = (req, res) => {
    Skill.findOneAndUpdate({_id: req.skillById}, {$set: req.body}, {new: true}, (err, skill) => {
        if(err) {
            return res.status(400).json({
                error: "Error"
            });
        }
        res.json(skill)
    });
};

exports.readAll = (req,res) => {
    User.find({_id: req.userId}).select("profile.skills").populate("profile.skills").exec((err, skills) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(skills);
    })
}