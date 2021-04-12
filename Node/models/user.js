const mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
const crypto = require("crypto");
const uuid = require("uuid");
const moment = require("moment");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    profile: {
      name: {
        type: String,
        trim: true, //any space in the string will be trimed out
        required: true,
        maxlength: 32,
      },
      lastName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
      },
      country:{
        type: String,
        required: true,
        maxlength: 20
      },
      about: {
        type: String,
        trim: true,
      },
      review: [
        {
          type: ObjectId,
          ref: "Review",
        },
      ],
      skills : [
        {
          type: ObjectId,
          ref: "Skill"
        }
      ],
      education: [
        {
         type: ObjectId,
         ref: "Education",
       },
     ],
     certification: [{
       type: ObjectId,
       ref: "Certification"
     }
     ],
      history: {
        loggedAt:[ {
          type: Date,
        }],
        activities: [
          {
            type: ObjectId,
            ref: "Task",
          },
        ],
      },
    },
    
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    status:{
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["user", "admin", "ambassador"],
      default: "user",
    },
  },
  { timestamps: true }
);

//virtual field

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid.v1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

  userSchema.methods = {
  authenticate: function (plaintText) {
    return this.encryptPassword(plaintText) === this.hashed_password;
  },
 

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

userSchema.plugin(mongoosePaginate);

/*participantSchema.virtual("password").set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
});

participantSchema.methods = {
    comparePassword(_password) {
        return bcrypt.compareSync(_password, this.hashedPassword);
    }
};*/

module.exports = mongoose.models.User || mongoose.model('User', userSchema);