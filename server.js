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

var Index = require("./index");
var Login = require("./loginOSC");

var fs = require('fs');




restService.post('/inputmsg', function(req, res) {

    var sessionId = req.body.sessionId;
    console.log("sessionId : " + sessionId);
    var content;

    content = fs.readFileSync('login.json', 'utf8');
    console.log("Content : " + content);
    content = JSON.parse(content);

    console.log("Content :" + JSON.stringify(content.items));

    var intentName = req.body.result.metadata.intentName;
    console.log("intentName : " + intentName);

    if (content.items.OSC[sessionId] != null) {
        var username = content.items.OSC[sessionId].username;
        var password = content.items.OSC[sessionId].password;
        console.log("username : " + username);
        console.log("password : " + password);

        Index(req, res, function(result) {
            console.log("Index Called");
        });
    } else {
        if (req.body.result.metadata.intentName == "Login") {
            console.log("Login Intent");
            // var username = req.body.result.parameters['username'];
            // var password = req.body.result.parameters['password'];

            Login(req, res, function(result) {
                console.log("Login Called");
            });
        } else {
            if (intentName == "Default Welcome Intent") {
                speech = "Hi There! My name is VIKI (Virtual Interactive Kinetic Intelligence) and I am here to help! Please Login. Try saying: I am Gokul and password is Gokul123";
            } else {
                speech = "Hi There! My name is VIKI (Virtual Interactive Kinetic Intelligence) and I am here to help!";
            }
            return res.json({
                speech: speech,
                displayText: speech
            })
        }
        // speech = "I will need your Sales Cloud Credentials. Try saying: I am Gokul and password is Oracle 123";
        // return res.json({
        //  speech: speech,
        //  displayText: speech
        // })
    }

});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});