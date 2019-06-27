var systemParameters = {};

var SystemParameter = require("../models/systemParameter");

//Function to add a system parameter
systemParameters.addParameter = function(parameterName, callback){
    
    var param = {   parameterName   : parameterName,
                    parameterValue  : ""            };
                    
    var paramQuery = {parameterName : parameterName};
    
    //Make sure we don't create duplicate parameters
    SystemParameter.findOne(paramQuery, function(err, parameter){
        if(err)
        {
            callback(err);
        }
        else
        {
            if(!parameter)
            {
                SystemParameter.create(param, function(err, paramter){
                    if(err)
                    {
                        callback(err);
                    }
                    else
                    {
                        callback(err);
                    }
                });
            }
            else
            {
                callback("The system parameter " 
                         + parameterName + " already exists!");
            }
        }
    });
                    
    
};

//Function to get a system parameter value
systemParameters.getParameterValue = function(parameterName, callback){
    
    var paramQuery = {parameterName : parameterName};
    
    SystemParameter.findOne(paramQuery, function(err, parameter){
        if(err)
        {
            console.log(err);
            callback(err, "");
        }
        else
        {
            if(!parameter)
            {
                callback(err, "");
            }
            else
            {
                callback(null, parameter.parameterValue);
            }
        }
    });
    
};

//Function to set a specific system parameter with a provided value
systemParameters.setParameterValue = function(parameterName, parameterValue, callback){
    
    var paramQuery = {parameterName : parameterName};
    
    SystemParameter.findOne(paramQuery, function(err, parameter){
        
        if(err)
        {
            callback(err);
        }
        else
        {
            if(!parameter)
            {
                callback("Could not find activity parameter " + parameterName);
            }
            else
            {
                parameter.parameterValue = parameterValue;
                parameter.save();
                callback(err);
            }
        }
        
    });
    
};



module.exports = systemParameters;