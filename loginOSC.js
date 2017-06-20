module.exports = function(req, res) {
  const express = require('express');
  const bodyParser = require('body-parser');
  const restService = express();
  var http = require('https');
  var fs = require('fs');


    var sessionId = req.body.sessionId;
    console.log("sessionId : " + sessionId);
    var content;

    content = fs.readFileSync('login.json', 'utf8');
    console.log("Content : " + content);
    content = JSON.parse(content);


      console.log("Login Intent");
      var username = req.body.result.contexts[0].parameters['username.original'];
      var password = req.body.result.contexts[0].parameters['password.original'];

      var http = require('https');
      options = {
          host: 'acs.crm.ap2.oraclecloud.com',
          path: "/crmCommonApi/resources/latest/accounts",
          headers: {
              'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
          }
      };
      var responseString = '';
      var request = http.get(options, function(resx) {
        resx.on('data', function(data) {
            responseString += data;
        });
        resx.on('end', function() {
            try{
                var resObj = JSON.parse(responseString);
                var jsonMap = {
                    "username" : username,
                    "password" : password
                }
                content.items.OSC[sessionId] = jsonMap;
                
                console.log("Content :" + JSON.stringify(content) );
                content = JSON.stringify( content, null, 2);
                fs.writeFile('login.json', content, function(){
                  speech = "Thanks! " + username + ", You are logged in! What can I do for you?";
                    return res.json({
                      speech: speech,
                      displayText: speech
                    })
                });
            }
            catch(error){
                speech = "Log in error! Make sure Credentials are correct!";
                console.log( "Error : " + error);
                return res.json({
                    speech: speech,
                    displayText: speech
                    //source: 'webhook-OSC-oppty'
                })
            }
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}