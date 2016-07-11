var formidable = require("formidable");
var util = require("util");
var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var bodyParser= require('body-parser')

var streznik = express();

var fs = require('fs');
var http = require('http');

var httpServer = http.createServer(streznik);

httpServer.listen(80, function(){
	console.log("Streznik posluša na vratih 80.");
});

var adminPassword="pivkap";  // geslo administratorskega računa

streznik.use(express.static('public'));

//  // Skrivni ključ za podpisovanje piškotkov
streznik.use(bodyParser.json());
streznik.use(
  expressSession({
    secret: '1234567890QWERTY',
    saveUninitialized: true,    // Novo sejo shranimo
    resave: false,              // Ne zahtevamo ponovnega shranjevanja
    cookie: {
      maxAge: 3600000           // Seja poteče po 60min neaktivnosti v ms
    }
  })
);

streznik.get("/", function(zahteva, odgovor){

	if(!zahteva.session.uporabnik){
		odgovor.sendFile(path.join(__dirname, 'public', 'stran-uporabnik.html'));
	}else{
		odgovor.sendFile(path.join(__dirname, 'public', 'stran-administrator.html'));
		
	}
	
})

streznik.get("/login", function(zahteva, odgovor){
	odgovor.sendFile(path.join(__dirname, 'public', 'login.html'));
})

streznik.post("/odjava", function(zahteva, odgovor){
	zahteva.session.uporabnik=null;
	odgovor.json(JSON.stringify({odjava:true}));
})

streznik.post("/checkLogin", function(zahteva, odgovor){
	
	var uporabniskoIme = zahteva.body.username;
	var geslo = zahteva.body.password;

	console.log("username "+zahteva.body.username + "\npassword "+zahteva.body.password);
	var ajaxOdgovor;
	
	if(uporabniskoIme=="admin" && geslo == adminPassword){
		zahteva.session.uporabnik=uporabniskoIme;
		ajaxOdgovor={
			pravilno : true,
			preusmeritev : "/"
		}
	}else{
		ajaxOdgovor={
			pravilno : false,
			preusmeritev : "/"
		}
	}
      	odgovor.json(JSON.stringify(ajaxOdgovor));
})

streznik.get("*", function(zahteva, odgovor){	
		odgovor.redirect("/");
})
