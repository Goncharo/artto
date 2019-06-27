var middlewareObj = {};

var sysParamUtil = require("../util/systemParameters");
var constants = require("../util/constants");

//Middleware to ensure user is logged in
middlewareObj.isLoggedIn = function(req, res, next)
{
    
    if(req.user && !req.user.verified)
    {
        req.logout();
        req.flash("error", "You need to verify your email before logging in.");
        return res.redirect("/");
    }
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error", "You need to be logged in.");
        return res.redirect("/");
    }
    
};

//Middleware to ensure the system is not currently in a blackout
middlewareObj.noBlackout = function(req, res, next)
{
    
    sysParamUtil.getParameterValue(constants.curSelState, function(err, value){
        
        if(err)
        {
            req.flash("error", "Oops, something went wrong.");
            console.log(err);
            return res.redirect("/home");
        }
        else if(value === constants.curSelState_SELECTING)
        {
            req.flash("warning", "Artto is currently selecting the most aesthetic submissions,"
            + " so no new submissions can be made at this time. Please check back later!");
            return res.redirect("/home");
        }
        else if(value === constants.curSelState_OPEN)
        {
            return next();
        }
        else
        {
            req.flash("error", "Oops, something went wrong.");
            return res.redirect("/home");
        }
        
    });
    
};

//Middleware to ensure the user is connected to Stripe
middlewareObj.connectedToStripe = function(req, res, next)
{
    
    if(req.user.connectedToStripe)
    {
        return next();
    }
    else
    {
        req.flash("error", "Please connect your account to Stripe first!");
        return res.redirect("/profile");
    }
    
};

module.exports = middlewareObj;