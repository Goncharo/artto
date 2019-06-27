var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var constants = require("../util/constants");
var request = require("request");

const stripe = require("stripe")(constants.keySecret);

router.get("/charge", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){

    if(!req.user.hasPayed && !req.user.hasSubmitted)
    {
        req.flash("success", "Please pay the submission fee to be able to create a submission for this round!");
        return res.render("payments/payment", {keyPublishable: constants.keyPublishable});
    }
    else if(req.user.hasPayed && !req.user.hasSubmitted)
    {
        req.flash("success", "You have already paid the subission fee for this round, make some art!");
        return res.redirect("/art");
    }
    else if(req.user.hasPayed  && req.user.hasSubmitted)
    {
        req.flash("warning", "You have already created a submission for this round!");
        return res.redirect("/home");
    }   
    
});

router.get("/connect", middleware.isLoggedIn, function(req, res){
        
        if(req.query.error)
        {
            req.flash("error", req.query.error_description);
            return res.redirect("/profile");
        }
        else
        {
            var form = {
                client_secret:constants.keySecret,
                code:req.query.code,
                grant_type:"authorization_code"
            };
    
            request.post({url:constants.stripeAccessURL, form:form}, function(err, response, body){
                if(!err && response.statusCode === 200)
                {
                    var data = JSON.parse(body);
                    req.user.stripe_user_id = data.stripe_user_id;
                    req.user.stripe_refresh_token = data.refresh_token;
                    req.user.connectedToStripe = true;
                    req.user.save();
                    console.log(req.user);
                    req.flash("success", "Account successfully connected to Stripe!");
                    return res.redirect("/profile");
        
                }
                else
                {
                    req.flash("error", "Oops, something went wrong!");
                    return res.redirect("/profile");
                }
                
            });
            
        }
    
});

router.post("/charge/:userID", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    //charge user $1
    var amount = constants.chargePerSubmission;
    
    stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
    })
    .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
    .then(function(charge){
        if(charge.paid)
        {
            req.user.hasPayed = true;
            req.user.save();
            req.flash("success", "Payment successful! Make some art!");
            res.redirect("/art");
        }
        else
        {
            req.flash("error", charge.outcome.seller_message);
            res.redirect("/charge");
        }
    });

});

module.exports = router;