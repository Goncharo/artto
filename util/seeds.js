var seeds = {};
var User = require("../models/user");
var Submission = require("../models/submission");
var SystemParameter = require("../models/systemParameter");
var constants = require("./constants");
var sysParamUtil = require("./systemParameters");

//================================================
//Function to initialize debug environment
//================================================
seeds.initDebugEnv = function(callback){
    SystemParameter.remove({}, function(err) {
        if(err)
        {
            callback(err);
        }
        else
        {
            console.log("removed system parameters...");
            
            Submission.remove({}, function(err) {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    console.log("removed submissions...");
                    User.remove({}, function(err){
                       if(err)
                       {
                           callback(err);
                       }
                       else
                       {
                           console.log("creating admin users...");
                            var newUser = new User({
                                username: "admin",
                                email: "dima.goncharov@hotmail.com",
                                verified: true,
                                connectedToStripe: true,
                                sessionEmails: 0
                            });
                            
                            User.register(newUser, "admin", function(err, user){
                                
                                if(err)
                                {
                                    callback(err);
                                }
                                else
                                {
                                    console.log("admin account created");
                                    var newUser2 = new User({
                                        username: "admin2",
                                        email: "dima.goncharov@hotmail.com",
                                        verified: true,
                                        connectedToStripe: true,
                                        sessionEmails: 0
                                    });
                                    
                                    User.register(newUser2, "admin", function(err, user){
                                        
                                        if(err)
                                        {
                                            callback(err);
                                        }
                                        else
                                        {
                                            console.log("admin account created");
                                            
                                            var newUser3 = new User({
                                                username: "admin3",
                                                email: "chovanes@sfu.ca",
                                                verified: true,
                                                connectedToStripe: true,
                                                sessionEmails: 0
                                            });
                                            
                                            User.register(newUser3, "admin", function(err, user){
                                                
                                                if(err)
                                                {
                                                    callback(err);
                                                }
                                                else
                                                {
                                                    console.log("admin account created");
                                                    
                                                    var newUser4 = new User({
                                                        username: "admin4",
                                                        email: "chovanes@sfu.ca",
                                                        verified: true,
                                                        connectedToStripe: true,
                                                        sessionEmails: 0
                                                    });
                                                    
                                                    User.register(newUser4, "admin", function(err, user){
                                                        
                                                        if(err)
                                                        {
                                                            callback(err);
                                                        }
                                                        else
                                                        {
                                                            
                                                            console.log("admin account created");
                                                            callback(null);
                                                        }
                                                        
                                                    });
                                                }
                                                
                                            });
                                            
                                            
                                        }
                                        
                                    });
                                }
                                
                            });
                       }
                    });
                } 
            });
            
       }
    });
    
};

//================================================
// System parameter seeds
//================================================
seeds.initializeSystemParameters = function(){
    
    constants.systemParameters.forEach(param => {
        
        sysParamUtil.addParameter(param, err => {
            
            // initialize parameters with default values if 
            // they didn't exist already
            if(err)
            {
                console.log(err);
            }
            else if(param === constants.curSelState)
            {
                sysParamUtil.setParameterValue(
                    param, constants.curSelState_OPEN, function(err){
                        if(err)
                        {
                            console.log(err);
                        } 
                        else
                        {
                            console.log("System parameter " + param 
                            + " initialized with value " + constants.curSelState_OPEN);
                        }
                    });
            }
            else if(param === constants.prevSelState)
            {
                sysParamUtil.setParameterValue(
                    param, constants.prevSelState_NONE, function(err){
                        if(err)
                        {
                            console.log(err);
                        } 
                        else
                        {
                            console.log("System parameter " + param 
                            + " initialized with value " + constants.prevSelState_NONE);
                        }
                    });
            }
            else if(param === constants.curSelUserID)
            {
                sysParamUtil.setParameterValue(
                    param, "", function(err){
                        if(err)
                        {
                            console.log(err);
                        } 
                        else
                        {
                            console.log("System parameter " + param 
                            + " initialized with empty initial value");
                        }
                    });
            }
             
        });
    });
    
};

//================================================
// Submission seeds
//================================================
seeds.createDummySubmissions = function(){
    
    for(var i = 0; i < 20; i++)
    {
        var submission = {value : {value:550},chosenForHOF:true,artist:{username:"lol"},dateSubmitted:Date.now(),title:"yoyoyo"};
        
        Submission.create(submission, function(err, submission){
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("created submission");
            }
        });
    }
    
};


module.exports = seeds;