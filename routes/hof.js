var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Submission = require("../models/submission");


//Route to render the hall of fame
router.get("/hof", function(req, res){

    Submission.paginate({chosenForHOF : true}, { page:1, limit: 4 }, 
    function(err, result){
        if(err)
        {
            console.log(err);   
            res.render("home");
        }
        else
        {
            res.render("hof/hof", {submissions:result.docs});
        }
    });
    
});

//Route for HOF pagination
router.get("/hofPage", function(req, res){
    
    var retObj = {};

    Submission.paginate({chosenForHOF : true}, { page: req.query.page, limit: 4 }, 
    function(err, result){
        if(err)
        {
            retObj.error = err;
            console.log(err);
            return res.send(JSON.stringify(retObj));
        }
        else
        {
            retObj.docs = result.docs;
            return res.send(JSON.stringify(retObj));
        }
    });
     
});

module.exports = router;