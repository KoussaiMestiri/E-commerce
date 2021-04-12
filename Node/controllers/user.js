const User = require('../models/User')


exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user) {
            return res.status(400).json({
                error: "User Not Found"
            });
        }
        req.profile = user.profile;
        req.userId = user._id
        next();
    })
};

exports.read = (req, res) => {

   User.findOne({_id: req.userId}).populate('profile.review').exec((err,user) => {
    if(err){
        return res.status(400).json({
            error:" Error"
        });
    }
   res.status(200).json({user})
})
};

exports.readAll = (req, res) => {
var regex = new RegExp(req.query.name,"i");
let query = {status: req.query.status || {$in: ["pending", "active"]} ,$or :[{"profile.name" : regex}, {"profile.lastName": regex}]};
    let options = {
        page : parseInt(req.query.page) || 1,
        limit : parseInt(req.query.limit) || 5,
        select: "profile.name"
    }
    User.paginate(query, options , (err,users) => {
        if(err){
            return res.status(400).json({
                error:" Error"
            });
        }
       res.status(200).json({users})
    })
 };


exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.userId}, {$set: req.body}, {new: true}, (err, user) => {
        if(err) {
            return res.status(400).json({
                error: "You Are Not Authorized Tp Perform This Action"
            });
        }
        req.hashed_password = undefined;
        user.salt = undefined;
        res.json(user)
    });
};