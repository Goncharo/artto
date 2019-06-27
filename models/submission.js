var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
require('mongoose-double')(mongoose);

var SubmissionSchema = new mongoose.Schema({
    dateSubmitted: Date,
    rank: Number,
    chosenForHOF: Boolean,
    hofContender: Boolean,
    title: String,
    value: mongoose.Schema.Types.Double,
    artist: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

SubmissionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Submission", SubmissionSchema);