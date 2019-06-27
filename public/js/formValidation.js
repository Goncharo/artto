document.addEventListener("DOMContentLoaded", function() {

    // HTML5 form validation

    var supports_input_validity = function()
    {
      var i = document.createElement("input");
      return "setCustomValidity" in i;
    }
    
    if(supports_input_validity()) {
        
        var usernameInput = document.getElementById("username");
        if(usernameInput)
        {
          usernameInput.setCustomValidity(usernameInput.title);
        }
        
        var pwd1Input = document.getElementById("password");
        pwd1Input.setCustomValidity(pwd1Input.title);
        
        var pwd2Input = document.getElementById("password_confirmation");
        
        // input key handlers
        if(usernameInput)
        {
          usernameInput.addEventListener("keyup", function() {
          usernameInput.setCustomValidity(this.validity.patternMismatch ? usernameInput.title : "");
          }, false);
        }
        
        pwd1Input.addEventListener("keyup", function() {
        this.setCustomValidity(this.validity.patternMismatch ? pwd1Input.title : "");
        
        if(this.checkValidity()) 
        {
          pwd2Input.pattern = this.value;
          pwd2Input.setCustomValidity(pwd2Input.title);
        } 
        else 
        {
          pwd2Input.pattern = this.pattern;
          pwd2Input.setCustomValidity("");
        }}, false);
        
        pwd2Input.addEventListener("keyup", function() {
        this.setCustomValidity(this.validity.patternMismatch ? pwd2Input.title : "");
        }, false);
    
    }

}, false);