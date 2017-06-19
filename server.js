'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

restService.post('/inputmsg', function(req, res) {

    var intentName = req.body.result.metadata.intentName;
    console.log( "intentName : " + intentName );
	if( intentName == "Default Welcome Intent"){
		try
		{
			http.get("https://vikinews.herokuapp.com");
			http.get("https://vikiviki.herokuapp.com");
			http.get("https://salty-tor-67194.herokuapp.com");
			http.get("https://opty.herokuapp.com");
		}
		catch(e)
		{
			console.log( "Error : " + e );
		}
	}
    var content;
    var speech = '';
    var varHost = '';
    var varPath = '';
    
    console.log( "intentName : " + intentName);
    try
    {
        if( intentName == 'News' || intentName == 'News - link' ){
            varHost = 'vikinews.herokuapp.com';
            varPath = '/inputmsg'; 
        }
		
		if( intentName == 'Budget' || intentName == 'Expense' ){
            varHost = 'vikiviki.herokuapp.com';
            varPath = '/inputmsg'; 
        }
        
        if( intentName == 'reporting' ){
            varHost = 'salty-tor-67194.herokuapp.com';
            varPath = '/report';
        }
        
        if( intentName == 'oppty' || intentName=='oppty - next' || intentName=='oppty - custom' || intentName=='oppty - News'  ){
            //varHost = 'polar-sea-99105.herokuapp.com';
            varHost = 'opty.herokuapp.com';
			varPath = '/oppty';
        }
        console.log( "varHost : " + varHost );
        console.log( "varPath : " + varPath);
        var newoptions = {
          host: varHost,
          path: varPath,
          data: req.body,
          method:'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        var body = "";
        var responseObject;

        var post_req = http.request(newoptions, function(response) {
          response.on('data', function (chunk) {
            body += chunk;
          });

          response.on('end', function() {
              console.log( "Body : " + body );
              try
              {
                responseObject = JSON.parse(body);
                speech = responseObject.speech;
                return res.json({
                  speech: speech,
                  displayText: speech
                })
              }
              catch(e){
                speech = "Error occured!";
                return res.json({
                  speech: speech,
                  displayText: speech
                })
              }
          })
        }).on('error', function(e){
          speech = "Error occured!";
            return res.json({
              speech: speech,
              displayText: speech
            })
        });
        post_req.write(JSON.stringify(req.body));
        post_req.end();
      
    }
    catch(e)
    {
        console.log("Error : " + e );
    }
	
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
