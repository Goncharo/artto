var mongoose = require("mongoose");

var SystemParameterSchema = new mongoose.Schema({
    parameterName: String,
    parameterValue: String
});

module.exports = mongoose.model("SystemParameter", SystemParameterSchema);