var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var constants = require("../util/constants");

module.exports = router;