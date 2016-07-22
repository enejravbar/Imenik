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

    if (!zahteva.session.uporabnik) {

        odgovor.sendFile(path.join(__dirname, 'public', 'stran-uporabnik.html'));
    } else {
        odgovor.sendFile(path.join(__dirname, 'public', 'stran-administrator.html'));

    }

})

streznik.get("/login", function(zahteva, odgovor) {
	
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

streznik.post("/registriraj", function(zahteva, odgovor) {

    pool.getConnection(function(napaka1, connection) {

        if (!napaka1) {
           
            var ime = zahteva.body.ime;
			var priimek = zahteva.body.priimek;
			var naslov = zahteva.body.naslov;

			var izbiraSkupine = zahteva.body.izbiraSkupine;		// tabela izbranih skupin
			var delovnoMesto= zahteva.body.delovnoMesto;		// id delovnega mesta	

			var tabelaEmailov =  zahteva.body.tabelaEmailov;
			var tabelaMobStevilk =  zahteva.body.tabelaMobStevilk;
			var tabelaStacStevilk = zahteva.body.tabelaStacStevilk;
            // vpisi uporabnika
            //console.log('INSERT INTO uporabnik (ime,priimek,naslov,id_del_mesto) VALUES (\''+ime+"\',\'"+priimek+"\',\'"+naslov+"\',\'"+delovnoMesto+'\');');

			console.log("ID delovno mesto "+ delovnoMesto);
			console.log("ID izbire skupin "+ izbiraSkupine);
			console.log("tabela mailov "+ tabelaEmailov);
			console.log("tabela mobilnih stevilk "+tabelaMobStevilk);
			console.log("tabela stacionarnih stevilk "+tabelaStacStevilk);

            // vnesi osebo v tabelo uporabnik in pridobi njegov ID 
            connection.query('INSERT INTO uporabnik (ime,priimek,naslov,id_del_mesto) VALUES (\''+ime+"\',\'"+priimek+"\',\'"+naslov+"\',\'"+delovnoMesto+'\');', function(napaka2, vrstice) {
                var napakaTabelaUporabnik=0;
                if (!napaka2) {

                	idOsebe= vrstice.insertId;
                	//console.log("ID uporabnika je: " + idOsebe); 
                	napakaTabelaUporabnik=1;

                	var idOsebe;

                	// sledi vnos v OSTALE TABELE -----------------------------------

		            //------- VNOS V TABELO SKUPINE-UPORABNIK ------------

			        for(var i=0;i<izbiraSkupine.length; i++){
			        	connection.query('INSERT INTO skupine_uporabnik (id_skupina,id_uporabnik) VALUES (\''+izbiraSkupine[i]+"\',\'"+idOsebe+'\');', function(napaka3, vrstice) {
			        		var napakaTabelaSkupineUporabnik=0;
			                if (!napaka3) {
			                	napakaTabelaSkupineUporabnik=1;
			                   
			                } else {
			                	odgovor.json(JSON.stringify({
                                    vpisano: false,
                                    sporocilo: "NAPAKA! Pri vpisovanju v pod. bazo."
                                }));
			                }

			            });
			        }    
		            
			         //------- VNOS V TABELO EMAIL ------------
		            
			        for(var i=0;i<tabelaEmailov.length; i++){
			        	connection.query('INSERT INTO email (id_uporabnik,email) VALUES (\''+idOsebe+"\',\'"+tabelaEmailov[i]+'\');', function(napaka4, vrstice) {
			                 var napakaTabelaEmail=0;
			                if (!napaka4) {
			                	napakaTabelaEmail=1;
			                   
			                } else {
			                	odgovor.json(JSON.stringify({
                                    vpisano: false,
                                    sporocilo: "NAPAKA! Pri vpisovanju v pod. bazo."
                                }));
			                }

			            });
			        } 

			        //------- VNOS V TABELO MOBILNE_STEVILKE ------------

			       for(var i=0;i<tabelaMobStevilk.length; i++){
			        	connection.query('INSERT INTO mobilne_stevilke (id_uporabnik,mob_kratka,mob_dolga) VALUES (\''+idOsebe+"\',\'"+tabelaMobStevilk[i].kratkaMobSt+"\',\'"+tabelaMobStevilk[i].mobSt+'\');', function(napaka5, vrstice) {
			                var napakaTabelaMobilneStevilke=0;
			                if (!napaka5) {
			                	napakaTabelaMobilneStevilke=1;
			                   
			                } else {
			                	odgovor.json(JSON.stringify({
                                    vpisano: false,
                                    sporocilo: "NAPAKA! Pri vpisovanju v pod. bazo."
                                }));
			                }

			            });
			        }

			        //------- VNOS V TABELO STACIONARNE_STEVILKE ------------

			        for(var i=0;i<tabelaStacStevilk.length; i++){
			        	connection.query('INSERT INTO stacionarne_stevilke (id_uporabnik,kratka_stac,dolga_stac) VALUES (\''+idOsebe+"\',\'"+tabelaStacStevilk[i].kratkaStacSt+"\',\'"+tabelaStacStevilk[i].stacSt+'\');', function(napaka6, vrstice) {
			                
			                var napakaTabelaStacionarneStevilke=0;
			                if (!napaka6) {
			                	napakaTabelaStacionarneStevilke=1;
			                   
			                } else {
			                	odgovor.json(JSON.stringify({
                                    vpisano: false,
                                    sporocilo: "NAPAKA! Pri vpisovanju v pod. bazo."
                                }));
			                }

			            });
			        }
                    odgovor.json(JSON.stringify({
                        vpisano: true,
                        sporocilo: ""
                    }));
	        
                } else {
                	odgovor.json(JSON.stringify({
                        vpisano: false,
                        sporocilo: "NAPAKA! Pri vpisovanju v pod. bazo."
                    }));

                }

            });
 
            connection.release();  // sprosti povezavo

        } else {
            odgovor.json(JSON.stringify({
                vpisano: false,
                sporocilo: "NAPAKA! Ni povezave z pod. bazo."
            }));
        }
    });

})

streznik.post("/isciZaposlene", function(zahteva, odgovor) {

    var ime= zahteva.body.ime;
    var priimek= zahteva.body.priimek;
    var naslov= zahteva.body.naslov;
    var email= zahteva.body.email;
    var mobSt= zahteva.body.mobSt;
    var kratkaMobSt= zahteva.body.kratkaMobSt;
    var stacSt= zahteva.body.stacSt;
    var kratkaStacSt= zahteva.body.kratkaStacSt;

    pool.getConnection(function(napaka1, connection) {
        if (!napaka1) {
            connection.query('SELECT u.id_uporabnik, u.ime, u.priimek, u.naslov FROM uporabnik u;', function(napaka2, tabelaUporabnik) {
                if (!napaka2) {
                    connection.query('SELECT u.id_uporabnik, e.email FROM uporabnik u, email e WHERE u.id_uporabnik = e.id_uporabnik;', function(napaka3, tabelaEmailov) {
                        if (!napaka3) {
                            connection.query('SELECT u.id_uporabnik, m.mob_dolga, m.mob_kratka FROM uporabnik u, mobilne_stevilke m WHERE u.id_uporabnik = m.id_uporabnik;', function(napaka4, tabelaMobStevilke) {
                                if (!napaka4) {
                                    
                                    connection.query('SELECT u.id_uporabnik, stac.dolga_stac, stac.kratka_stac FROM uporabnik u, stacionarne_stevilke stac WHERE u.id_uporabnik = stac.id_uporabnik;', function(napaka5, tabelaStacStevilke) {
                                        if (!napaka5) {
                                            connection.query('SELECT u.id_uporabnik, d.ime_del_mesto FROM uporabnik u, delovno_mesto d WHERE u.id_del_mesto = d.id_del_mesto;', function(napaka6, tabelaDelMesto) {
                                                if (!napaka6) {
                                                    connection.query('SELECT u.id_uporabnik, s.ime_skupina FROM uporabnik u, skupine s, skupine_uporabnik s_u WHERE u.id_uporabnik = s_u.id_uporabnik AND s_u.id_skupina=s.id_skupina;', function(napaka7, tabelaSkupine) {
                                                        if (!napaka7) {
                                                            var tabelaZaposlenih = kreirajTabeloZaposlenih(tabelaUporabnik, tabelaEmailov, tabelaMobStevilke, tabelaStacStevilke, tabelaDelMesto, tabelaSkupine);
                                                           
                                                            odgovor.json(JSON.stringify({
                                                                uspeh: true,
                                                                podatki: null
                                                            }));
                                                        } else {
                                                            odgovor.json(JSON.stringify({
                                                                uspeh: false,
                                                                podatki: null
                                                            }));
                                                        }
                                                    });
                                                    
                                                } else {
                                                    odgovor.json(JSON.stringify({
                                                        uspeh: false,
                                                        podatki: null
                                                    }));
                                                }
                                            });
                                            
                                        } else {
                                            odgovor.json(JSON.stringify({
                                                uspeh: false,
                                                podatki: null
                                            }));
                                        }
                                    });

                                } else {
                                    odgovor.json(JSON.stringify({
                                        uspeh: false,
                                        podatki: null
                                    }));
                                }
                            });

                        } else {
                            odgovor.json(JSON.stringify({
                                uspeh: false,
                                podatki: null
                            }));
                        }
                    });
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

streznik.get("*", function(zahteva, odgovor) {
    odgovor.redirect("/");
})

function kreirajTabeloZaposlenih(tabelaUporabnik, tabelaEmailov, tabelaMobStevilke, tabelaStacStevilke, tabelaDelMesto, tabelaSkupine){
    var tabelaZaposlenih=[];
    var idZaposlenega;
    console.log("ID uporabnika je: " +tabelaUporabnik[0].id_uporabnik);
    for(var i=0; i<tabelaUporabnik.length; i++){

        idZaposlenega = tabelaUporabnik[i].id_uporabnik;
        console.log("idZaposlenega = " + idZaposlenega);
        var zaposlenaOseba={
            id : idZaposlenega,
            ime : tabelaUporabnik[i].ime,
            priimek : tabelaUporabnik[i].priimek,
            naslov : tabelaUporabnik[i].naslov,
            delMesto : "",
            email : [],
            mobStevilke : [],
            stacStevilke : [],
            skupine : []
        }

        for(var j=0; j<tabelaDelMesto.length; j++){
            if(tabelaDelMesto[j].id_uporabnik == idZaposlenega){
               zaposlenaOseba.delMesto = tabelaDelMesto[j].ime_del_mesto;
            }
        }

        for(var j=0; j<tabelaEmailov.length; j++){
             //console.log(tabelaEmailov[i].email);
            if(tabelaEmailov[j].id_uporabnik == idZaposlenega){
                zaposlenaOseba.email.push(tabelaEmailov[j].email);
                /*console.log(tabelaEmailov);
                console.log("id zaposlenega "+ idZaposlenega + " Pridobivam email "+tabelaEmailov[j].email);*/
            }
        }

        for(var j=0; j<tabelaMobStevilke.length; j++){
            if(tabelaMobStevilke[j].id_uporabnik == idZaposlenega){
                var mobStevilka={
                    mob_dolga : tabelaMobStevilke[j].mob_dolga,
                    mob_kratka : tabelaMobStevilke[j].mob_kratka
                };
                zaposlenaOseba.mobStevilke.push(mobStevilka);
            }
        }

        for(var j=0; j<tabelaStacStevilke.length; j++){
            if(tabelaStacStevilke[j].id_uporabnik == idZaposlenega){
                var stacStevilka={
                    stac_dolga : tabelaStacStevilke[j].dolga_stac,
                    stac_kratka : tabelaStacStevilke[j].kratka_stac
                };
                zaposlenaOseba.stacStevilke.push(stacStevilka);
            }
        }

        for(var j=0; j<tabelaSkupine.length; j++){
            if(tabelaSkupine[j].id_uporabnik == idZaposlenega){
                zaposlenaOseba.skupine.push(tabelaSkupine[j].ime_skupina);
                console.log("Pridobivam skupino "+tabelaSkupine[j].ime_skupina);
            }
        }
        tabelaZaposlenih.push(zaposlenaOseba);

    }
    //console.log("Tabela zaposlenih : "+ tabelaZaposlenih[0].id + " " + tabelaZaposlenih[0].ime + " " +tabelaZaposlenih[0].priimek + " "+tabelaZaposlenih[0].naslov);
    console.log(tabelaZaposlenih);
    return tabelaZaposlenih;
}

function sortirajZaposlene(){
    
}