var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verifyToken: String,
    passwordResetToken: String,
    sellToken: String,
    verified: Boolean,
    hasPayed: Boolean,
    hasSubmitted: Boolean,
    stripe_user_id: String,
    stripe_refresh_token: String,
    connectedToStripe: Boolean,
    dateCreated: Date,
    timeStarted: Date,
    sessionEmails: Number,
    submissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        }
    ]
}, {usePushEach : true});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);