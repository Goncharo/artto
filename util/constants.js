var constants = {};

//================================================
//Values for limiting users or emails
//================================================
constants.maxUsers              = 100;
constants.maxEmails             = 40;

//================================================
//Regex Constants for Registration Validation
//================================================
constants.usernameRegex         = /[a-zA-Z0-9_]{4,12}/;
constants.passwordRegex         = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}/;
constants.emailRegex            = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//================================================
//Values for server captcha validation
//================================================
constants.captchaURL            = "https://www.google.com/recaptcha/api/siteverify";
constants.captchaSecret         = process.env.ARTTO_CAPTCHA_SECRET_KEY;
constants.captchaPublic         = process.env.ARTTO_CAPTCHA_PUBLIC_KEY;

//================================================
//Mailgun API Keys
//================================================

//Your api key, from Mailgun’s Control Panel
constants.api_key               = process.env.ARTTO_MAILGUN_API_KEY;

//Your domain, from the Mailgun Control Panel
constants.domain                = process.env.ARTTO_MAILGUN_DOMAIN;

//Your sending email address
constants.from_who              = 'support@artto.com';

//================================================
//Stripe API Keys, URLs, and Config
//================================================

//Keys
constants.keyPublishable = process.env.ARTTO_STRIPE_PUBLISHABLE_KEY;
constants.keySecret = process.env.ARTTO_STRIPE_SECRET_KEY;
constants.client_id = process.env.ARTTO_STRIPE_CLIENT_ID;

//URLs
constants.stripeConnectURL = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" 
                             + constants.client_id + "&scope=read_write";
constants.stripeAccessURL = "https://connect.stripe.com/oauth/token";

//Config
constants.chargePerSubmission = 100; //in cents
constants.stripeProcessingFee = 30; //in cents
constants.stripeServiceCharge = 0.029; //2.9 percent
constants.appServiceCharge = 0.01; //1 percent

//================================================
//Application URL
//================================================
constants.appURL                = process.env.ARTTO_APP_URL;

//================================================
//Submission Config
//================================================
constants.numSelections         = 10;
constants.submissionWidth       = 1024;
constants.submissionHeight      = 576;

//================================================
//System parameters Config
//================================================

// all system wide parameter value names go here
constants.curSelState           = "current_selection_state";
constants.prevSelState          = "previous_selection_state";
constants.curSelUserID          = "currently_selected_userID";
constants.systemParameters      = [constants.curSelState, constants.prevSelState, constants.curSelUserID];

// possible states for current selection
constants.curSelState_OPEN      = "OPEN";
constants.curSelState_SELECTING = "SELECTING";

// map for current state to HTML string
constants.curSelStateToHTMLStringMap = new Map();
constants.curSelStateToHTMLStringMap.set(
    constants.curSelState_OPEN, 
    "Artto is currently accepting submissions for the next selection!");
constants.curSelStateToHTMLStringMap.set(
    constants.curSelState_SELECTING, 
    "Artto is currently selecting the most aesthetic user submissions! No new submissions are accepted at this time.");

// possible states for previous selection
constants.prevSelState_NONE     = "NONE";
constants.prevSelState_SELECTED = "SELECTED";
constants.prevSelState_SOLD     = "SOLD";
constants.prevSelState_KEPT     = "KEPT";

// map for previous state to HTML string
constants.prevSelStateToHTMLStringMap = new Map();
constants.prevSelStateToHTMLStringMap.set(
    constants.prevSelState_NONE, 
    "No selection state to display, be the first to have your art in the Hall of Fame!");
constants.prevSelStateToHTMLStringMap.set(
    constants.prevSelState_SELECTED, 
    "The most aesthetic artists have been selected and Artto is waiting for a reply!");
constants.prevSelStateToHTMLStringMap.set(
    constants.prevSelState_SOLD, 
    "One of the selected artists has sold their submission to the Artto Hall of Fame!");
constants.prevSelStateToHTMLStringMap.set(
    constants.prevSelState_KEPT, 
    "All of the selected artists have chosen to keep their submissions!");



module.exports = constants;