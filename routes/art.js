var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Submission = require("../models/submission");
var mailUtil = require("../util/mailUtil");
var paymentUtil = require("../util/paymentUtil");
var sysParamUtil = require("../util/systemParameters");
var constants = require("../util/constants");
var middleware = require("../middleware");
var randomWords = require('random-words');
var fs = require('fs');

const stripe = require("stripe")(constants.keySecret);

//Route to render drawing application
router.get("/art", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    if(req.user.hasPayed && !req.user.hasSubmitted)
    {
        req.user.timeStarted = Date.now();
        req.user.save();
        res.render("art/art");
    }
    else if(!req.user.hasPayed)
    {
        req.flash("error", "You must pay before creating a submission!");
        res.redirect("/home");
    }
    else if(req.user.hasSubmitted)
    {
        req.flash("error", "You've alreay made a submission for this round!");
        res.redirect("/home");
    }
    
});

//Route to create new submission
router.post("/art/:userID", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    if(Date.now() > (req.user.timeStarted.getTime() + 65000)) //Checks for 65 seconds between start and end of drawing period
    {
        req.flash("error", "You only have 60 seconds to create a piece of art!");
        res.redirect("/home");
    }
    else if(!req.user.hasPayed)
    {
        req.flash("error", "You must pay before creating a submission!");
        res.redirect("/home");
    }
    else if(req.user.hasSubmitted)
    {
        req.flash("error", "You've alreay made a submission for this round!");
        res.redirect("/home");
    }
    else
    {
        User.findById(req.params.userID, function(err, user){
            if(err)
            {
                console.log(err);
                res.redirect("/");
            }
            else
            {
                var submission = {value : 0};
                
                Submission.create(submission, function(err, submission){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        // if the user didn't specify a title, or they specified one over 40 characters, generate a random one
                        if (req.body.title.length > 40)
                        {
                            var title = randomWords({ min: 2, max: 4, join: ' ' });
                        }
                        else
                        {
                            var title = (req.body.title === "") ? 
                                randomWords({ min: 2, max: 4, join: ' ' }) : req.body.title;
                        }
                        
                        submission.artist.id = user._id;
                        submission.artist.username = user.username;
                        submission.chosenForHOF = false;
                        submission.hofContender = false;
                        submission.rank = 0;
                        submission.dateSubmitted = Date.now();
                        submission.title = title;
                        submission.save(function(err) {
                            if(err)
                            {
                                req.flash("error", "Error with submission, please try again!" + err);
                                res.redirect("/home");
                            }
                            else
                            {
                                var img = req.body.img;
                                var data = img.replace(/^data:image\/\w+;base64,/, "");
                                var buf = new Buffer(data, 'base64');
                                var uniqueFileName = __dirname + '/../public/submissions/' + submission._id + '.png';
                                fs.writeFile(uniqueFileName, buf, 'base64', function(err){
                                    if(err)
                                    {
                                        console.log(err)
                                        req.flash("error", "Error with submission, please try again! " + err);
                                        res.redirect("/home");
                                    }
                                    else
                                    {
                                        req.user.submissions.push(submission);
                                        req.user.markModified('submissions');
                                        req.user.hasSubmitted = true;
                                        req.user.save(function(err){
                                            if(err){
                                                console.log(err);
                                                req.flash("error", "Error with submission, please try again! " + err);
                                                res.redirect("/home");
                                            }
                                            else
                                            {
                                                req.flash("success", "Art submission successful." 
                                                            + " You will be contacted by email if your art was chosen!");
                                                res.redirect("/home");
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

//Route to sell submission to Hall of Fame
router.get("/sell/:accountID/:token", [middleware.isLoggedIn, middleware.noBlackout, middleware.connectedToStripe], function(req, res){
    
    //Make sure the correct user is trying to sell the art
    if(!req.user._id.equals(req.params.accountID))
    {
        req.flash("error", "You cannot sell another user's submission!");
        return res.redirect("/home");
    }
    
    User.findById(req.params.accountID).populate("submissions").exec(function(err, user){
    
        if(err)
        {
            console.log(err);
            return res.redirect("/");
        }
        else
        {
            if(user.sellToken != "" 
                && user.sellToken === req.params.token)
            {
                var chosenIndex = user.submissions.findIndex(function(sub){
                    return sub.hofContender;
                });
                
                //Copy submission to Hall of Fame
                console.log(chosenIndex)
                console.log(user.submissions)
                var uniqueFileName = __dirname + '/../public/hofContenders/' + user.submissions[chosenIndex]._id + '.png';
                var hofFileName = __dirname + '/../public/hof/' + user.submissions[chosenIndex]._id + '.png';
                fs.rename(uniqueFileName, hofFileName, function(err){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        //Set the previous selection state to SOLD
                        sysParamUtil.setParameterValue(constants.prevSelState, constants.prevSelState_SOLD, function(err){
                            if(err)
                            {
                                console.log(err);
                                res.redirect("/");
                            }
                            else
                            {
                                //Reset the currently selected user ID 
                                sysParamUtil.setParameterValue(constants.curSelUserID, "", function(err){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        //Schedule user payment
                                        paymentUtil.scheduleUserPayment(
                                            user.submissions[chosenIndex].value.value, user.stripe_user_id);

                                        //Choose this submission for the HOF
                                        user.submissions[chosenIndex].chosenForHOF = true;
                                        user.submissions[chosenIndex].hofContender = false;
                                        user.submissions[chosenIndex].save();
                                        user.sellToken = "";
                                        user.save();
                                        
                                        req.flash("success", "Congratulations, your art is now in the Artto Hall of Fame! "
                                                                + "The payment for your art will be sent to your Stripe account in 7 days.");
                                        res.redirect("/hof");
                                    }
                                });  

                            }
                        });
                    }
                });

            }
            else
            {
                res.redirect("/");
            }
            
        }

    });
    
});

//Router to keep art submission
router.get("/keep/:accountID/:token",  [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    //Make sure the correct user is trying to keep the art
    if(!req.user._id.equals(req.params.accountID))
    {
        req.flash("error", "You cannot keep another user's submission!");
        return res.redirect("/home");
    }
    
    User.findById(req.params.accountID).populate("submissions").exec(function(err, user){
    
        if(err)
        {
            console.log(err);
            return res.redirect("/");
        }
        else
        {
            if(user.sellToken != "" 
                && user.sellToken === req.params.token)
            {
                
                var chosenIndex = user.submissions.findIndex(function(sub){
                    return sub.hofContender;
                });
                
                var nextRank = user.submissions[chosenIndex].rank + 1;
                var successMessage = "Thank you for responding, and enjoy your art! "
                                     + "The user will the next most aesthetic submission will be emailed next.";
                
                //If we're on our last HOF contender, do nothing
                if(nextRank > constants.numSelections)
                {
                    req.flash("success", successMessage);
                    return res.redirect("/home");
                }
                
                //Find next ranked HOF contender and email the user
                Submission.findOne({rank : nextRank, hofContender : true}, function(err, submission){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        if(!submission)
                        {
                            //Set the previous selection state to KEPT
                            sysParamUtil.setParameterValue(constants.prevSelState, constants.prevSelState_KEPT, function(err){
                                if(err)
                                {
                                    console.log(err);
                                    res.redirect("/");
                                }
                                else
                                {
                                    //Reset the currently selected user ID 
                                    sysParamUtil.setParameterValue(constants.curSelUserID, "", function(err){
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            req.flash("success", "Thank you for responding, and enjoy your art!");
                                            res.redirect("/home");
                                        }
                                    });  
                                }
                            });
                            
                        }
                        else
                        {
                            User.findById(submission.artist.id, function(err, nextUser){
                                if(err)
                                {
                                    console.log(err);
                                    res.redirect("/");
                                }
                                else
                                {
                                    //Set the currently selected user ID to the next selected user ID
                                    sysParamUtil.setParameterValue(constants.curSelUserID, nextUser._id, function(err){
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            user.sellToken = "";
                                            user.save();
                                            mailUtil.sendSelectionMail(nextUser);
                                            req.flash("success", successMessage);
                                            res.redirect("/home");
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                
            }
            else
            {
                res.redirect("/");
            }
            
        }

    });
    
});

module.exports = router;