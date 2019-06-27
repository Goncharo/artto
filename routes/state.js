var express = require("express");
var router = express.Router();
var Submission = require("../models/submission");
var constants = require("../util/constants");
var sysParamUtil = require("../util/systemParameters");

router.get("/state/:type", function(req, res){
    
    var stateObj = {};
    
    //---------------------------------------------------
    // Get amount of time remaining until next selection
    //---------------------------------------------------

    var d = new Date(); 
    var seconds = d.getMinutes() * 60 + d.getSeconds();
    var tenmintime = seconds % (60*10);
    var timeResult;
    
    if(tenmintime < 60*4)
    {
        var timeleft = (60 * 4) - tenmintime; 
        timeResult = parseInt(timeleft / 60) + ':' + timeleft % 60;
    }
    else if(tenmintime<60*5)
    {
        var timeResult = "Currently selecting a winning piece of art!"
    }
    else if(tenmintime < 60*9)
    {
        var timeleft = (60 * 9) - tenmintime; 
        var timeResult = parseInt(timeleft / 60) + ':' + timeleft % 60;
    }
    else
    {
        var timeResult = "Currently Selecting the Most Aesthetic Art!"
    }

    stateObj.timeState = timeResult;
    
    //---------------------------------------------------
    // Get current number of submissions
    //---------------------------------------------------
    Submission.find({hofContender:false, chosenForHOF:false}, function(err, submissions){
		if(err)
		{
			console.log(err);
            stateObj.error = err;
			res.send(JSON.stringify(stateObj));
		}
		else
		{
		    stateObj.subCount = submissions.length;
			
            // if we're on the landing page, we don't need
            // any more state info
            if(req.params.type == "landing")
            {
                res.send(JSON.stringify(stateObj));
            }
            // if we're on the home page, get previous and
            // current selection state info as well
            else if (req.params.type == "home")
            {
                //---------------------------------------------------
                // Get previous selection state
                //---------------------------------------------------
                sysParamUtil.getParameterValue(constants.prevSelState, function(err, value){
                    if(err)
                    {
                        console.log(err);
                        stateObj.error = err;
                        res.send(JSON.stringify(stateObj));
                    }
                    else
                    {
                        stateObj.prevState = constants.prevSelStateToHTMLStringMap.get(value);
                        
                        //---------------------------------------------------
                        // Get previous selection state
                        //---------------------------------------------------
                        sysParamUtil.getParameterValue(constants.curSelState, function(err, value){
                            
                            if(err)
                            {
                                console.log(err);
                                stateObj.error = err;
                                res.send(JSON.stringify(stateObj));
                            }
                            else
                            {
                                stateObj.curState = constants.curSelStateToHTMLStringMap.get(value);
                                res.send(JSON.stringify(stateObj));
                            }   

                        });
                    }
                });
            }
            // if this is a garbage request, just return nothing
            else
            {
                res.send("");
            }
		}
	});

});


module.exports = router;