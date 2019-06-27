var mailUtil = {};

var Mailgun = require('mailgun-js');
var crypto = require("crypto");
var constants = require("./constants");
var Submission = require("../models/submission");
var User = require("../models/user");

mailUtil.sendMail = function(to, subject, body, error, attachment)
{
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: constants.api_key, domain: constants.domain});

    var data = {
    //Specify email data
      from: constants.from_who,
    //The email to contact
      to: to,
    //Subject and text data  
      subject: subject,
      html: body
    };
    
    //attach attachment, if specified
    if(attachment)
    {
      data.attachment = attachment;
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            error = err;
        }
    });
};

mailUtil.sendSelectionMail = function(user)
{
    var sellToken = crypto.randomBytes(32).toString('hex');
    user.sellToken = sellToken;
    user.save();
    var sellUrl = constants.appURL + "/sell/" + user._id + "/" + sellToken;
    var keepUrl = constants.appURL + "/keep/" + user._id + "/" + sellToken;
    var subject = "Your Artto submission has been chosen as most aesthetic!";
    
    var body = '<p>Hi ' + user.username + ',</p>';
    body += '<p>Congratulations, your submission has been chosen as most aesthetic! ';
    body += 'If you wish to sell your art, click the link below to sell it to the Artto Hall of Fame!</p>';
    body += ' <p><a href="' + sellUrl + '">Sell</a></p>';
    body += '<p>Alternatively, if you wish to keep your art, you can click the link below.</p>';
    body += ' <p><a href="' + keepUrl + '">Keep</a></p>';
    body += '<p>Cheers,</p>';
    body += '<p>Artto Team</p>';
    
    //find hof contender belonging to this user so we can attach it to the email
    Submission.find({ hofContender : true }, function(err, submissions){
      
      if(err)
      {
        console.log(err);
      }
      else
      {
          submissions.forEach(submission => {
        
            if(submission.artist.id.equals(user._id))
            {
              var error;
              var attachment = __dirname + '/../public/hofContenders/' + submission._id + '.png';
              
              mailUtil.sendMail(user.email, subject, body, error, attachment);
              if(error)
              {
                console.log(error);
              }
            }
        });
      }
    });
};

mailUtil.resetSessionEmails = function()
{
  User.find({}, function(err, users){
    
    if(err)
    {
      console.log(err);
    }
    else
    {
      users.forEach(user => {
        user.sessionEmails = 0;
        user.save();
      });
    }
    
  });
};

module.exports = mailUtil