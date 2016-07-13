var formidable = require("formidable");
var util = require("util");
var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var bodyParser = require('body-parser')
var mysql = require('mysql');

var streznik = express();

var fs = require('fs');
var http = require('http');

var httpServer = http.createServer(streznik);

httpServer.listen(80, function() {
    console.log("Streznik posluša na vratih 80.");
});

var adminPassword = "pivkap"; // geslo administratorskega računa

streznik.use(express.static('public'));

//  // Skrivni ključ za podpisovanje piškotkov
streznik.use(bodyParser.json());
streznik.use(
    expressSession({
        secret: '1234567890QWERTY',
        saveUninitialized: true, // Novo sejo shranimo
        resave: false, // Ne zahtevamo ponovnega shranjevanja
        cookie: {
            maxAge: 3600000 // Seja poteče po 60min neaktivnosti v ms
        }
    })
);

var pool = mysql.createPool({
    host: '10.10.101.71',
    user: 'imenik',
    password: 'imenik',
    database: 'imenik',
    charset: 'UTF8_GENERAL_CI'
});

/*connection.connect(function(napaka1){
	if(!napaka1){
		console.log("Povezava z podatkovno bazo je uspešno vzpostavljena.");
	}else{
		console.log("NAPAKA! Povezava z podatkovno bazo NI VZPOSTAVLJENA.");
	}
});*/

streznik.get("/", function(zahteva, odgovor) {
	zahteva.session.uporabnik="/";
    if (!zahteva.session.uporabnik) {

        odgovor.sendFile(path.join(__dirname, 'public', 'stran-uporabnik.html'));
    } else {
        odgovor.sendFile(path.join(__dirname, 'public', 'stran-administrator.html'));

    }

})

streznik.get("/login", function(zahteva, odgovor) {
	zahteva.session.uporabnik="/login";
	if(zahteva.session.uporabnik){
		odgovor.redirect("/");
	}else{
		odgovor.sendFile(path.join(__dirname, 'public', 'login.html'));
	}
    
})

streznik.post("/odjava", function(zahteva, odgovor) {
    zahteva.session.uporabnik = null;
    odgovor.json(JSON.stringify({
        odjava: true
    }));
})


streznik.post("/dodajSkupino", function(zahteva, odgovor) {

    pool.getConnection(function(napaka1, connection) {

        if (!napaka1) {
            var imeNoveSkupine = zahteva.body.imeSkupine;

            connection.query('INSERT INTO skupine (ime_skupina) VALUES (\"' + imeNoveSkupine + '\");', function(napaka2, info) {
                if (!napaka2) {
                    //console.log("Skupina uspešno vnešena! ID: "+ info.insertId);
                    odgovor.json(JSON.stringify({
                        vpisano: true,
                        id: info.insertId

                    }));
                } else {
                    //console.log("NAPAKA pri vnosu nove skupine: "+ info.insertId);
                    odgovor.json(JSON.stringify({
                        vpisano: false,
                        id: null,
                        sporocilo: "NAPAKA! Vnos ni bil uspešen."
                    }));
                }

            });

            connection.release();

        } else {
            odgovor.json(JSON.stringify({
                vpisano: false,
                id: null,
                sporocilo: "NAPAKA! Ni povezave z pod. bazo."
            }));
        }
    });
});

streznik.post("/seznamSkupin", function(zahteva, odgovor) {

    pool.getConnection(function(napaka1, connection) {

        if (!napaka1) {
            var imeNoveSkupine = zahteva.body.imeSkupine;

            connection.query('SELECT * FROM skupine;', function(napaka2, vrstice) {
                if (!napaka2) {
                    odgovor.json(JSON.stringify({
                        uspeh: true,
                        podatki: vrstice
                    }));
                    console.log(vrstice);
                } else {
                    odgovor.json(JSON.stringify({
                        uspeh: false,
                        podatki: null
                    }));
                }

            });
            connection.release();

        } else {
            odgovor.json(JSON.stringify({
                vpisano: false,
                id: null,
                sporocilo: "NAPAKA! Ni povezave z pod. bazo."
            }));
        }
    });

});

streznik.post("/dodajDelovnoMesto", function(zahteva, odgovor) {

    pool.getConnection(function(napaka1, connection) {
        if (!napaka1) {

            var imeDelovnoMesto = zahteva.body.imeNovegaDelovnegaMesta;

            connection.query('INSERT INTO delovno_mesto(ime_del_mesto) VALUES (\"' + imeDelovnoMesto + '\");', function(napaka2, info) {
                if (!napaka2) {
                    //console.log("Delovno mesto uspešno vnešeno! ID: "+ info.insertId);
                    odgovor.json(JSON.stringify({
                        vpisano: true,
                        id: info.insertId
                    }));
                } else {
                    console.log("NAPAKA pri vnosu novega delovnega mesta." + napaka2);
                    odgovor.json(JSON.stringify({
                        vpisano: false,
                        id: null
                    }));
                }

            });

            connection.release();

        } else {
            odgovor.json(JSON.stringify({
                vpisano: false,
                id: null,
                sporocilo: "NAPAKA! Ni povezave z pod. bazo."
            }));
        }
    });
});

streznik.post("/seznamDelovnihMest", function(zahteva, odgovor) {

    pool.getConnection(function(napaka1, connection) {
        if (!napaka1) {
            connection.query('SELECT * FROM delovno_mesto;', function(napaka2, vrstice) {
                if (!napaka2) {
                    odgovor.json(JSON.stringify({
                        uspeh: true,
                        podatki: vrstice
                    }));
                    console.log(vrstice);
                } else {
                    odgovor.json(JSON.stringify({
                        uspeh: false,
                        podatki: null
                    }));
                }

            });
            connection.release();

        } else {
            odgovor.json(JSON.stringify({
                vpisano: false,
                id: null,
                sporocilo: "NAPAKA! Ni povezave z pod. bazo."
            }));
        }
    });

});




streznik.post("/checkLogin", function(zahteva, odgovor) {

    var uporabniskoIme = zahteva.body.username;
    var geslo = zahteva.body.password;

    //console.log("username "+zahteva.body.username + "\npassword "+zahteva.body.password);
    var ajaxOdgovor;

    if (uporabniskoIme == "admin" && geslo == adminPassword) {
        zahteva.session.uporabnik = uporabniskoIme;
        ajaxOdgovor = {
            pravilno: true,
            preusmeritev: "/"
        }
    } else {
        ajaxOdgovor = {
            pravilno: false,
            preusmeritev: "/"
        }
    }
    odgovor.json(JSON.stringify(ajaxOdgovor));
})

streznik.get("*", function(zahteva, odgovor) {
    odgovor.redirect("/");
})

