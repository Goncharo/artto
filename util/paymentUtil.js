var constants = require("./constants");
var schedule = require('node-schedule');
const stripe = require("stripe")(constants.keySecret);

var paymentUtil = {};

// Schedule payment to be sent in 7 days to user who sold the art.
// This will ensure we have sufficient funds in our Stripe account
// before we pay our users.
paymentUtil.scheduleUserPayment = function(amount, stripeUserID){

    var paymentAmount = amount;
    var userID = stripeUserID;
    var now = new Date();

    //add 7 days to current date
    now.setDate(now.getDate() + 7);

    //schedule job to start in 7 days
    console.log(`Scheduling payment of $${paymentAmount} to user in 7 days.`);

    schedule.scheduleJob(now, function(){

        stripe.transfers.create({
            amount: paymentAmount,
            currency: "usd",
            destination: userID
            }, function(err, transfer) {
            if(err)
            {
                console.log(`Failed to transfer payment of $${paymentAmount} to user! Error:`);
                console.log(err);
            }
            else
            {
                console.log(`Successfully transerred payment of $${paymentAmount} to user!`);
            }
        });

    });

};

module.exports = paymentUtil