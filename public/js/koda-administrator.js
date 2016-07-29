
var timer,timer1,timer2,timer3,timer4,timer5;
var tabelaSkupin=[];	
var tabelaDelovnihMest=[];

var tabelaIskanihZaposlenih = [];

var idTrenutnegaObravnavanegaZaposlenega;

$(document).ready(function(){
	izberiZavihek();
	skrijIskalnik();
	oznaciVse();
	gumbDodajNovoSkupino();
	pridobiVseSkupine();
	gumbOsveziSkupine();

	gumbDodajNovoDelovnoMesto();
	pridobiVsaDelovnaMesta();
	gumbOsveziDelovnaMesta();

	gumb_izbrisiSkupino();
	gumb_izbrisiDelovnoMesto();
	/*sortirajPoImenuDelovnegaMesta();
	sortirajPoImenuSkupine();*/   // pri sortiranju lahko pride do problemov, ker več funkcij uporablja isto tabelo

	// ----------- UREDI ZAPOSLENEGA ----------

	urediZaposlenega_prikaziSkupine("urediZaposlenega-izberiSkupine");
	urediZaposlenega_prikaziDelovnaMesta();
	urediZaposlenega_dodajanjeEmailov();
	urediZaposlenega_dodajanjeMobStevilk();
	urediZaposlenega_dodajanjeStacStevilk();
	urediZaposlenega_brisanjeVrsticPriRegistraciji();
	

	urediZaposlenega();

	// ----------- DODAJ NOV VPIS -------------
	prikaziSkupine("registracija-izberiSkupine");
	dodajanjeEmailov();
	dodajanjeMobStevilk();
	dodajanjeStacStevilk();
	brisanjeVrsticPriRegistraciji();
	prikaziDelovnaMesta();
	registrirajNovegaZaposlenega();

	//------------ DOMOV ------------------
	prikaziSkupineDomov();
	isciZaposlene();
	sortirajTabeloZaposlenih();
	//testSort();
	gumb_izvoziCSVZIzbranimiZaposlenimi();
	//gumb_izvoziCSVZVsemiZaposlenimi();
	gumb_posljiEmail();
	gumb_izbrisiZaposlenega();
	gumb_dodajZaposlenegaVSkupino();
	gumb_odstraniZaposlenegaIzSkupine();
	naloziCSVDatoteko();

	gumb_urediZaposlenega();
	
});

// --------------------------------- UREDI ZAPOSLENEGA ---------------------------------

function urediZaposlenega(){
	$("#gumb-urediZaposlenega").click(function(){
		
		var ime = $("#urediZaposlenega-ime").val();
		var priimek = $("#urediZaposlenega-priimek").val();
		var naslov = $("#urediZaposlenega-naslov").val();

		/* dobili smo pozicije izbranih elementov v tabeli */
		
		var izbiraSkupine = urediZaposlenega_pridobiIndekseIzbranih("urediZaposlenega-izberiSkupine");	//tabela izbranih skupin
		izbiraSkupine= urediZaposlenega_pridobiTabeloIDjevZaSkupine(izbiraSkupine);

		var delovnoMesto= $('#urediZaposlenega-delovnoMesto').find(":selected").index();
		delovnoMesto=  urediZaposlenega_pridobiIDZaDelovnoMesto(delovnoMesto);

		var tabelaEmailov =  urediZaposlenega_pridobiEmaile("urediZaposlenega-seznam-emailov");
		var tabelaMobStevilk =  urediZaposlenega_pridobiMobStevilke("urediZaposlenega-seznam-mobStevilk");
		/*for(var i=0; i<tabelaMobStevilk.length; i++){
			console.log("Element v tabeli " +tabelaMobStevilk[i].mobSt);
		}*/
		var tabelaStacStevilk = urediZaposlenega_pridobiStacStevilke("urediZaposlenega-seznam-stacStevilk");

		if(urediZaposlenega_validacijaVnesenihPodatkov(ime,priimek,naslov,izbiraSkupine)){
			
			var ajaxSporocilo={
				ime:ime,
				priimek:priimek,
				naslov:naslov,
				izbiraSkupine:izbiraSkupine, 
				delovnoMesto:delovnoMesto,
				tabelaEmailov:tabelaEmailov,
				tabelaMobStevilk:tabelaMobStevilk,
				tabelaStacStevilk:tabelaStacStevilk,
			};

			$.ajax({
			    type: "POST",
			    url: "/registriraj",
			    dataType: 'json',
			    contentType: 'application/json', 
			    async: true,
			    data: JSON.stringify(ajaxSporocilo),

			    success: function (odgovor){
		            odgovor=JSON.parse(odgovor);
			        if(odgovor.vpisano){

			           urediZaposlenega_izbrisiZaposlenega(idTrenutnegaObravnavanegaZaposlenega);
			           prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
		            }else{
		            	
		            }

			    },
			    error: function (napaka){
			    	
			    }	
			});

			
		}

		/*console.log("delovno mesto "+ delovnoMesto);
		console.log("izbira skupine "+ izbiraSkupine);
		console.log("tabela mailov "+ tabelaEmailov);
		console.log("tabela mobilnih stevilk "+tabelaMobStevilk);
		console.log("tabela stacionarnih stevilk "+tabelaStacStevilk);*/

	});
		
}

function urediZaposlenega_izbrisiZaposlenega(idZaposlenega){
	$.ajax({
	    type: "POST",
	    url: "/izbrisiZaposlenega",
	    dataType: 'json',
	    contentType: 'application/json', 
	    async: true,
	    data: JSON.stringify({ idUporabnika: idZaposlenega  }),

	    success: function (odgovor){
            odgovor=JSON.parse(odgovor);
	        if(odgovor.uspeh){
	             clearTimeout(timer3);
	            $("#gumb-urediZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-success"});
				$("#gumb-urediZaposlenega-okvir").css({
				"display" : ""
				});
				$("#gumb-urediZaposlenega-okvir span").text("Podatki uspešno posodobljeni!");

				timer3 = setTimeout(function() {
	            $("#gumb-urediZaposlenega-okvir").hide('slow');
	        	}, 4000);	
            }else{
            	clearTimeout(timer3);
            	$("#gumb-urediZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
				$("#gumb-urediZaposlenega-okvir").css({
				"display" : ""
				});
				$("#gumb-urediZaposlenega-okvir span").text("Podatki niso bili uspešno posodobljeni!");

				timer3 = setTimeout(function() {
	            $("#gumb-urediZaposlenega-okvir").hide('slow');
	        	}, 4000);	
            }

	    },
	    error: function (napaka){
	    	clearTimeout(timer3);
	    	$("#gumb-urediZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
			$("#gumb-urediZaposlenega-okvir").css({
			"display" : ""
			});
			$("#gumb-urediZaposlenega-okvir span").text("NAPAKA! Težava z AJAX zahtevkom.");

			timer3 = setTimeout(function() {
            $("#gumb-urediZaposlenega-okvir").hide('slow');
        	}, 4000);
}	
	});
}

function indeksSkupine(idSkupina){
	for(var i=0; i< tabelaSkupin.length;i++){
		console.log(tabelaSkupin);
		if(idSkupina == tabelaSkupin[i].id_skupina){
			
			return i;
		}
	}
}

function indeksDelovnegaMesta(idDelMesto){
	for(var i=0; i< tabelaDelovnihMest.length;i++){
		//console.log(tabelaSkupin);
		if(idDelMesto == tabelaDelovnihMest[i].id_del_mesto){
			console.log("Indeks delovnega mesta je: " + idDelMesto+" i = " + i);
			return i;
		}
	}
}

function ponastaviIzborZaSkupine(){
	$("#urediZaposlenega-izberiSkupine option").each(function(){
			$(this).removeAttr("selected");
			console.log("Pobrisani izbrani elementi!")
		});
}

function gumb_urediZaposlenega(){
	$(document).on('click', '.urediZaposlenega', function(){
		var indeksZaposlenega = $(this).parent().parent().index();
		
		var izbraniZaposleni = tabelaIskanihZaposlenih[indeksZaposlenega];

		idTrenutnegaObravnavanegaZaposlenega= izbraniZaposleni.id;

		console.log(izbraniZaposleni);
		$("#urediZaposlenega-ime").val(izbraniZaposleni.ime);
		$("#urediZaposlenega-priimek").val(izbraniZaposleni.priimek);
		$("#urediZaposlenega-naslov").val(izbraniZaposleni.naslov);
		$("#urediZaposlenega-dodajEmail").val("");
		$("#urediZaposlenega-dodajMobStevilko").val("");
		$("#urediZaposlenega-dodajKratkoMobStevilko").val("");

		$("#urediZaposlenega-dodajStacStevilko").val("");
		$("#urediZaposlenega-dodajKratkoStacStevilko").val("");

		// ponastavi nastavitve

		$("#urediZaposlenega-seznam-emailov").html("");
		$("#urediZaposlenega-seznam-mobStevilk").html("");
		$("#urediZaposlenega-seznam-stacStevilk").html("");

		ponastaviIzborZaSkupine();
		console.log("izbraniZaposleni.skupine.length = "+ izbraniZaposleni.skupine.length);
		for(var i=0; i<izbraniZaposleni.skupine.length; i++){
			var indeksSkupineVTabeli = indeksSkupine(izbraniZaposleni.skupine[i].idSkupina);
			console.log("indeks skupine je "+ indeksSkupineVTabeli);
			$("#urediZaposlenega-izberiSkupine").find("option").each(function(){
				if($(this).index() == indeksSkupineVTabeli){
					$(this).prop("selected", true);
					console.log("Obarvam skupino " + tabelaSkupin[indeksSkupineVTabeli].ime_skupina);
				}else{
					
				}
			});
		}

		$("#urediZaposlenega-delovnoMesto").find("option").each(function(){

				var indeksDelMestoVTabeli = indeksDelovnegaMesta(izbraniZaposleni.idDelMesto);
				$("#urediZaposlenega-delovnoMesto").find("option").each(function(){
					if($(this).index() == indeksDelMestoVTabeli){
							$(this).prop("selected", true);
					}
				});
			});

		// prikaži trenune e-maile
		var html;

		for(var i=0; i<izbraniZaposleni.email.length;i++){
			if(izbraniZaposleni.email[i] == ""){continue;}
			html="<tr style=\"border:0;\">" +
	                 "   <td>"+izbraniZaposleni.email[i]+"</td>" +
	                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-emailov").append(html);
		}
		
		for(var i=0; i<izbraniZaposleni.mobStevilke.length; i++){
			if(izbraniZaposleni.mobStevilke[i].mob_dolga == "" || izbraniZaposleni.mobStevilke[i].mob_kratka == ""){continue;}
			var html="<tr style=\"border:0;\">" +
		                 "   <td>"+izbraniZaposleni.mobStevilke[i].mob_dolga+"</td>" +
		                 "   <td>"+izbraniZaposleni.mobStevilke[i].mob_kratka+"</td>" +
		                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-mobStevilk").append(html);
		}

		for(var i=0; i<izbraniZaposleni.stacStevilke.length; i++){
			if(izbraniZaposleni.stacStevilke[i].stac_dolga == "" || izbraniZaposleni.stacStevilke[i].stac_kratka == ""){continue;}
			var html="<tr style=\"border:0;\">" +
		                 "   <td>"+izbraniZaposleni.stacStevilke[i].stac_dolga+"</td>" +
		                 "   <td>"+izbraniZaposleni.stacStevilke[i].stac_kratka+"</td>" +
		                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-stacStevilk").append(html);
		}

	});
}



/*Iz pozicij izbranih v GUI vmesniku pridobimo dejanske ID-je teh skupin*/
function urediZaposlenega_pridobiTabeloIDjevZaSkupine(tabelaPozicij){
	var tabelaIdjev = [];
	var pozicija=0;
	for(var i=0; i<tabelaPozicij.length;i++){
		pozicija=tabelaPozicij[i];
		tabelaIdjev.push(tabelaSkupin[pozicija].id_skupina);
	}
	return tabelaIdjev;
}

function urediZaposlenega_pridobiIDZaDelovnoMesto(pozicijaDelovnegaMesta){
	var pozicija=pozicijaDelovnegaMesta;
	var idDelovnegaMesta= tabelaDelovnihMest[pozicija].id_del_mesto;

	return idDelovnegaMesta;
}

function urediZaposlenega_validacijaVnesenihPodatkov(ime,priimek,naslov,izbiraSkupine){

	var kontrola1=0,kontrola2=0,kontrola3=0,kontrola4=0;

	if(ime==""){
		$("#urediZaposlenega-ime").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#urediZaposlenega-ime").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola1=1;
	}

	if(priimek==""){
		$("#urediZaposlenega-priimek").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#urediZaposlenega-priimek").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola2=1;
	}

	if(naslov==""){
		$("#urediZaposlenega-naslov").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#urediZaposlenega-naslov").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola3=1;
	}
	if(izbiraSkupine.length!=0){
		kontrola4=1;
	}else{
		clearTimeout(timer2);
		kontrola=0;
		$("#urediZaposlenega-izberiSkupine-okvir").css({
			"display" : ""
		});
		timer2 = setTimeout(function() {
            $("#urediZaposlenega-izberiSkupine-okvir").hide('slow');
        }, 4000);
	}

	if(kontrola1 && kontrola2 && kontrola3 && kontrola4){
		return true;
	}else{
		return false;
	}

}

function urediZaposlenega_pridobiIndekseIzbranih(idSelecta){
	var tabelaIndeksov=[];
    $('#'+idSelecta+' option').each(function(i,v){
        if (this.selected){
        	tabelaIndeksov.push(i);
        } 
    });
    return tabelaIndeksov;
}

function urediZaposlenega_pridobiEmaile(idTabeleEmailov){
	var tabelaEmailov=[];
	var stevec=0;
    $('#'+idTabeleEmailov+' td').each(function(){
    	if(stevec%2==0){
    		tabelaEmailov.push($(this).html());	
    	}
    	stevec++;
    });
    return tabelaEmailov;
}

function urediZaposlenega_pridobiMobStevilke(idTabeleMobStevilk){
	var tabelaMobStevilk=[];
	var stevec=0;

	var podatkiTabele=$("#"+idTabeleMobStevilk).find('td');
	
    for(var i=0; i< podatkiTabele.length; i++){
    	var objekt;

    	if(stevec==0){
	    	objekt={
				mobSt:"",
				kratkaMobSt:""
			}
    		objekt.mobSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==1){
    		objekt.kratkaMobSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==2){
    		tabelaMobStevilk.push(objekt);
    		stevec=-1;
    	}
    	stevec++;
    }

	return tabelaMobStevilk;
    
}

function urediZaposlenega_pridobiStacStevilke(idTabeleStacStevilk){
	var tabelaStacStevilk=[];
	var stevec=0;

    var podatkiTabele=$("#"+idTabeleStacStevilk).find('td');
	
    for(var i=0; i< podatkiTabele.length; i++){
    	var objekt;

    	if(stevec==0){
	    	objekt={
				stacSt:"",
				kratkaStacSt:""
			}
    		objekt.stacSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==1){
    		objekt.kratkaStacSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==2){
    		tabelaStacStevilk.push(objekt);
    		stevec=-1;
    	}
    	stevec++;
    }

	return tabelaStacStevilk;
}



function urediZaposlenega_prikaziSkupine(idSelecta){
	//console.log("Deluje test test test");
	$("#"+idSelecta).html("");
	tabelaSkupin = pridobiVseSkupine();
	for(var i=0; i<tabelaSkupin.length; i++){
		$("#"+idSelecta).append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
	}
	
}

function urediZaposlenega_prikaziDelovnaMesta(){
	//console.log("Deluje test test test");
	$("#urediZaposlenega-delovnoMesto").html("");
	for(var i=0; i<tabelaDelovnihMest.length; i++){
		$("#urediZaposlenega-delovnoMesto").append("<option>"+tabelaDelovnihMest[i].ime_del_mesto+"</option>");
	}
	
}

function urediZaposlenega_dodajanjeEmailov(){
	$("#urediZaposlenega-dodajEmail-gumb").click(function(){

		var email=$("#urediZaposlenega-dodajEmail").val();

		if(email.indexOf("@")>-1 && email!=""){
			$("#urediZaposlenega-emailNaslov").attr({"class" : "input-group col-xs-12 col-sm-12"});

			var html="<tr style=\"border:0;\">" +
                 "   <td>"+email+"</td>" +
                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-emailov").append(html);
		}else{
			$("#urediZaposlenega-emailNaslov").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}
		
		
	});
	
}

function urediZaposlenega_dodajanjeMobStevilk(){
	$("#urediZaposlenega-dodajMobStevilko-gumb").click(function(){
		var mobStevilka=$("#urediZaposlenega-dodajMobStevilko").val();
		var kratkaMobStevilka=$("#urediZaposlenega-dodajKratkoMobStevilko").val();
		var kontrola1=0,kontrola2=0;

		if(mobStevilka!=""){
			kontrola1=1;
			$("#urediZaposlenega-dodajMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#urediZaposlenega-dodajMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kratkaMobStevilka!=""){
			kontrola2=1;
			$("#urediZaposlenega-dodajKratkoMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#urediZaposlenega-dodajKratkoMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kontrola1 && kontrola2){
			var html="<tr style=\"border:0;\">" +
		                 "   <td>"+mobStevilka+"</td>" +
		                 "   <td>"+kratkaMobStevilka+"</td>" +
		                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-mobStevilk").append(html);
		}
		
	
	});
	
}

function urediZaposlenega_dodajanjeStacStevilk(){
	$("#urediZaposlenega-dodajStacStevilko-gumb").click(function(){
		var stacStevilka=$("#urediZaposlenega-dodajStacStevilko").val();
		var kratkaStacStevilka=$("#urediZaposlenega-dodajKratkoStacStevilko").val();

		var kontrola1=0,kontrola2=0;

		if(stacStevilka!=""){
			kontrola1=1;
			$("#dodajStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#dodajStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kratkaStacStevilka!=""){
			kontrola2=1;
			$("#urediZaposlenega-dodajKratkoStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#urediZaposlenega-dodajKratkoStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kontrola1 && kontrola2){
			var html="<tr style=\"border:0;\">" +
	                 "   <td>"+stacStevilka+"</td>" +
	                 "   <td>"+kratkaStacStevilka+"</td>" +
	                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#urediZaposlenega-seznam-stacStevilk").append(html);
		}

	});
	
}

function urediZaposlenega_brisanjeVrsticPriRegistraciji(){
	$(document).on('click', '.registracija', function(){
		console.log("zaznal sem!");
		$(this).parent().parent().remove();

	});	

}



//---------------------------------- DOMOV -------------------------------------

function isciZaposlene(){
	$("#gumb-iskanje").click(function(){
		var ime=$("#iskanje-ime").val();
		var priimek=$("#iskanje-priimek").val();
		var naslov=$("#iskanje-naslov").val();
		var email=$("#iskanje-email").val();
		var mobSt=$("#iskanje-mobSt").val();
		var kratkaMobSt=$("#iskanje-kratkaMobSt").val();

		var stacSt=$("#iskanje-stacSt").val();
		var kratkaStacSt=$("#iskanje-kratkaStacSt").val();

		var izbiraSkupine = pridobiIndekseIzbranih("iskanje-izbiraSkupine");	//tabela izbranih skupin
		var poz= izbiraSkupine[0];
		var idSkupine;

		if(poz==0){  // to pomeni, da je bila izbrana možnost "vse skupine"
			idSkupine=-1;
			console.log("Izbrana je možnost " + izbiraSkupine);   // vsebuje -1, ki je indikator, da gre za možnost "vse skupine"
		}else{
			idSkupine= tabelaSkupin[poz-1].id_skupina;  	// vsebuje id oznacene skupine	
			console.log("Izbrana je možnost " + poz +" id skupine je "+idSkupine);
		}
		
		var ajaxSporocilo = {
			ime : ime,
			priimek : priimek,
			naslov : naslov,
			email : email,
			mobSt : mobSt,
			kratkaMobSt : kratkaMobSt,
			stacSt : stacSt,
			kratkaStacSt : kratkaStacSt,
			idSkupine: idSkupine
		}

		$.ajax({
			    type: "POST",
			    url: "/isciZaposlene",
			    dataType: 'json',
			    contentType: 'application/json', 
			    async: true,
			    data: JSON.stringify(ajaxSporocilo),

			    success: function (odgovor){
		          	var sporocilo=JSON.parse(odgovor);  
			        if(!sporocilo.uspeh){
			        	
			        	prikaziIskaneZaposlene(odgovor);
			            clearTimeout(timer4);
			            $("#prijava-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
						$("#prijava-okvir").css({
						"display" : ""
						});
						$("#prijava-okvir").text(odgovor.sporocilo);

						timer4 = setTimeout(function() {
			            $("#prijava-okvir").hide('slow');
			        	}, 4000);	
		            }else{
		            	tabelaIskanihZaposlenih = sporocilo.podatki;
		            	prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
		            	console.log("SPOROCILO.PODATKI : " + tabelaIskanihZaposlenih);
		            }

			    },
			    error: function (napaka){
			    	clearTimeout(timer4);
			    	$("#prijava-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
					$("#prijava-okvir").css({
					"display" : ""
					});
					$("#prijava-okvir").text("NAPAKA! Težava z AJAX zahtevkom.");

					timer4 = setTimeout(function() {
		            $("#prijava-okvir").hide('slow');
		        	}, 4000);
			    }	
			});
		//console.log(ime+" " + priimek +" " +naslov+ " " +email+" "+mobSt+" " +kratkaMobSt+" "+stacSt+" "+kratkaStacSt);
	});
}

function gumb_dodajZaposlenegaVSkupino(){
	$("#dodajZaposlenegaVSkupino").click(function(){
		var indeks;
		$("#dodajIzbraneVSkupino").find("option").each(function(){
			if(this.selected){
				indeks=$(this).index()-1;
				console.log("IndeksGumba je "+indeks);
			}
			
		});

		if(indeks!=-1){
			var objektSkupine = tabelaSkupin[indeks];
			console.log(objektSkupine);
			var tabelaPozicij=[];
		    $('#podatkiOZaposlenih input:checked').each(function(){
			       		tabelaPozicij.push($(this).parent().parent().index());
			});
			var tabelaIzbranihZaposlenih=[];
			for(var i=0; i<tabelaPozicij.length; i++){
				tabelaIzbranihZaposlenih.push( tabelaIskanihZaposlenih[tabelaPozicij[i]]);
			}

			
				for(var i=0; i<tabelaIzbranihZaposlenih.length; i++){
					console.log(tabelaIzbranihZaposlenih[i]);
					dodajZaposlenegaVSkupino(tabelaIzbranihZaposlenih[i],objektSkupine);
				}
		}
		
	});
}

function dodajZaposlenegaVSkupino(objektZaposlenega,objektSkupina){

	var zaposleni=objektZaposlenega;
	for(var i=0; i<zaposleni.skupine.length;i++){
		if(zaposleni.skupine[i].idSkupina==objektSkupina.id_skupina){
			console.log("Oseba je že vsebovana v skupini!");
			return;
		}
	}
	// če oseba še ni v teji skupini jo dodamo

	$.ajax({
	    type: "POST",
	    url: "/dodajVSkupino",
	    dataType: 'json',
	    contentType: 'application/json', 
	    async: true,
	    data: JSON.stringify({ idZaposlenega: objektZaposlenega.id, idSkupine:objektSkupina.id_skupina}),

	    success: function (odgovor){
            odgovor=JSON.parse(odgovor);
	        if(odgovor.uspeh){
	            $("#gumb-iskanje").click();
            }else{
            	
            }
	    },
	    error: function (napaka){
	    	
	    }	
	});
}
function gumb_odstraniZaposlenegaIzSkupine(){
	$("#odstraniZaposlenegaIzSkupine").click(function(){
		var indeks;
		$("#odstraniIzbraneIzSkupine").find("option").each(function(){
			if(this.selected){
				indeks=$(this).index()-1;
				console.log("IndeksGumba je "+indeks);
			}
			
		});

		if(indeks!=-1){
			var objektSkupine = tabelaSkupin[indeks];
			console.log(objektSkupine);
			var tabelaPozicij=[];
		    $('#podatkiOZaposlenih input:checked').each(function(){
			       		tabelaPozicij.push($(this).parent().parent().index());
			});
			var tabelaIzbranihZaposlenih=[];
			for(var i=0; i<tabelaPozicij.length; i++){
				tabelaIzbranihZaposlenih.push( tabelaIskanihZaposlenih[tabelaPozicij[i]]);
			}

			
				for(var i=0; i<tabelaIzbranihZaposlenih.length; i++){
					console.log(tabelaIzbranihZaposlenih[i]);
					odstraniZaposlenegaIzSkupine(tabelaIzbranihZaposlenih[i],objektSkupine);
				}
		}
		
	});
}

function odstraniZaposlenegaIzSkupine(objektZaposlenega,objektSkupina){

	var zaposleni=objektZaposlenega;
	var jeVSkupini=false;
	for(var i=0; i<zaposleni.skupine.length;i++){
		if(zaposleni.skupine[i].idSkupina==objektSkupina.id_skupina){
			console.log("Oseba ni vsebovana v skupini!");
			jeVSkupini=true;
			
		}
		
	}
	// če oseba še ni v teji skupini jo dodamo
	if(jeVSkupini){
		$.ajax({
		    type: "POST",
		    url: "/odstraniIzSkupine",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify({ idZaposlenega: objektZaposlenega.id, idSkupine:objektSkupina.id_skupina}),

		    success: function (odgovor){
	            odgovor=JSON.parse(odgovor);
		        if(odgovor.uspeh){
		            $("#gumb-iskanje").click();
	            }else{
	            	
	            }
		    },
		    error: function (napaka){
		    	
		    }	
		});
	}
	
}

function prikaziSkupineDomov(){
	//console.log("Deluje test test test");
	tabelaSkupin = pridobiVseSkupine();
	$("#iskanje-izbiraSkupine").html("<option>Vse skupine</option>");
	$("#dodajIzbraneVSkupino").html("<option></option>");
	$("#odstraniIzbraneIzSkupine").html("<option></option>");
	for(var i=0; i<tabelaSkupin.length; i++){
		$("#iskanje-izbiraSkupine").append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
		$("#dodajIzbraneVSkupino").append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
		$("#odstraniIzbraneIzSkupine").append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
	}
	
}

function prikaziIskaneZaposlene(tabelaZaposlenih){

	$("#podatkiOZaposlenih").html(""); // resetiraj tabelo

	var html="";
	console.log(tabelaZaposlenih);

	for(var i=0; i<tabelaZaposlenih.length; i++){
		html="<tr>"+
             "   <td><input type=\"checkbox\"></td>" +
             "   <td>"+tabelaZaposlenih[i].ime+"</td> "+
             "   <td>"+tabelaZaposlenih[i].priimek+"</td> "+
             "   <td>"+tabelaZaposlenih[i].naslov+"</td> "+
             "   <td>";
             for(var j=0; j<tabelaZaposlenih[i].skupine.length; j++){
             	if( j== tabelaZaposlenih[i].skupine.length-1 ){
             		html+= tabelaZaposlenih[i].skupine[j].imeSkupina+"</td>";
             	}
             	html+= tabelaZaposlenih[i].skupine[j].imeSkupina+"<br>";
             }

             html+= "<td>"+tabelaZaposlenih[i].delMesto+"</td> <td>";

             for(var j=0; j<tabelaZaposlenih[i].email.length; j++){
             	if(j == tabelaZaposlenih[i].email.length-1 ){
             		html+= tabelaZaposlenih[i].email[j]+"</td>";
             	}
             	html+= tabelaZaposlenih[i].email[j]+"<br>";
             }

             html+="<td>";

             for(var j=0; j<tabelaZaposlenih[i].mobStevilke.length; j++){
             	if(j == tabelaZaposlenih[i].mobStevilke.length-1 ){
             		html+= tabelaZaposlenih[i].mobStevilke[j].mob_dolga+"</td>";
             	}
             	html+= tabelaZaposlenih[i].mobStevilke[j].mob_dolga+"<br>";
             }

             html+="<td>";

             for(var j=0; j<tabelaZaposlenih[i].mobStevilke.length; j++){
             	if(j == tabelaZaposlenih[i].mobStevilke.length-1 ){
             		html+= tabelaZaposlenih[i].mobStevilke[j].mob_kratka+"</td>";
             	}
             	html+= tabelaZaposlenih[i].mobStevilke[j].mob_kratka+"<br>";
             }

             html+="<td>";

             for(var j=0; j<tabelaZaposlenih[i].stacStevilke.length; j++){
             	if(j == tabelaZaposlenih[i].stacStevilke.length-1 ){
             		html+= tabelaZaposlenih[i].stacStevilke[j].stac_dolga+"</td>";
             	}
             	html+= tabelaZaposlenih[i].stacStevilke[j].stac_dolga+"<br>";
             }

             html+="<td>";

             for(var j=0; j<tabelaZaposlenih[i].stacStevilke.length; j++){
             	if(j == tabelaZaposlenih[i].stacStevilke.length-1 ){
             		html+= tabelaZaposlenih[i].stacStevilke[j].stac_kratka+"</td>";
             	}
             	html+= tabelaZaposlenih[i].stacStevilke[j].stac_kratka+"<br>";
             }
             html+= "<td>" +
                    "   <button style=\"margin-top:5px;\" class=\"urediZaposlenega btn btn-primary btn-sm\" data-target=\"#urediZaposlenega\" data-toggle=\"modal\">Uredi</button>" + 
                    "</td>" + 
                    "</tr>";

             $("#podatkiOZaposlenih").append(html);

	}
}

function sortirajTabeloZaposlenih(){

	$("#urediPoImenu").click(function(){
		var temp="";
		console.log("Sortiram tabelo zaposlenih!");
		for(var interval=0; interval<tabelaIskanihZaposlenih.length; interval++){
			for(var i=1; i<tabelaIskanihZaposlenih.length; i++){
				if(tabelaIskanihZaposlenih[i-1].ime > tabelaIskanihZaposlenih[i].ime){
					temp= tabelaIskanihZaposlenih[i-1];
					tabelaIskanihZaposlenih[i-1]=tabelaIskanihZaposlenih[i];
					tabelaIskanihZaposlenih[i]=temp;
				}
			}
		}
		prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
	});

	$("#urediPoPriimku").click(function(){
		var temp="";
		console.log("Sortiram tabelo zaposlenih!");
		for(var interval=0; interval<tabelaIskanihZaposlenih.length; interval++){
			for(var i=1; i<tabelaIskanihZaposlenih.length; i++){
				if(tabelaIskanihZaposlenih[i-1].priimek > tabelaIskanihZaposlenih[i].priimek){
					temp= tabelaIskanihZaposlenih[i-1];
					tabelaIskanihZaposlenih[i-1]=tabelaIskanihZaposlenih[i];
					tabelaIskanihZaposlenih[i]=temp;
				}
			}
		}
		prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
	});

	$("#urediPoNaslovu").click(function(){
		var temp="";
		console.log("Sortiram tabelo zaposlenih!");
		for(var interval=0; interval<tabelaIskanihZaposlenih.length; interval++){
			for(var i=1; i<tabelaIskanihZaposlenih.length; i++){
				if(tabelaIskanihZaposlenih[i-1].naslov > tabelaIskanihZaposlenih[i].naslov){
					temp= tabelaIskanihZaposlenih[i-1];
					tabelaIskanihZaposlenih[i-1]=tabelaIskanihZaposlenih[i];
					tabelaIskanihZaposlenih[i]=temp;
				}
			}
		}
		prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
	});

	$("#urediPoDelovnemMestu").click(function(){
		var temp="";
		console.log("Sortiram tabelo zaposlenih!");
		for(var interval=0; interval<tabelaIskanihZaposlenih.length; interval++){
			for(var i=1; i<tabelaIskanihZaposlenih.length; i++){
				if(tabelaIskanihZaposlenih[i-1].delMesto > tabelaIskanihZaposlenih[i].delMesto){
					temp= tabelaIskanihZaposlenih[i-1];
					tabelaIskanihZaposlenih[i-1]=tabelaIskanihZaposlenih[i];
					tabelaIskanihZaposlenih[i]=temp;
				}
			}
		}
		prikaziIskaneZaposlene(tabelaIskanihZaposlenih);
	});

}

function gumb_izbrisiZaposlenega(){

	    $( '#izbrisiZaposlenega' ).bootstrap_confirm_delete(
        {
            debug:              false,
            heading:            'Brisanje',
            message:            'Ali si prepričan izbrisati označene zaposlene iz imenika?',
            btn_ok_label:       'Izbriši',
            btn_cancel_label:   'Prekliči',

            delete_callback:    function() { 
            	
            	var tabelaPozicij=[];
			    $('#podatkiOZaposlenih input:checked').each(function(){
				       		tabelaPozicij.push($(this).parent().parent().index());
				});
			    var tabelaIDjevIzbranihZaposlenih = pridobiTabeloIdjevZaposlenih(tabelaPozicij);

            	for(var i=0; i<tabelaIDjevIzbranihZaposlenih.length; i++){
			    	$.ajax({
					    type: "POST",
					    url: "/izbrisiZaposlenega",
					    dataType: 'json',
					    contentType: 'application/json', 
					    async: true,
					    data: JSON.stringify({ idUporabnika: tabelaIDjevIzbranihZaposlenih[i]}),

					    success: function (odgovor){
				            odgovor=JSON.parse(odgovor);
					        if(odgovor.uspeh){
					            clearTimeout(timer5);
					            $("#gumb-iskanje").click();
					            $("#izbrisiZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-success"});
								$("#izbrisiZaposlenega-okvir").css({
								"display" : ""
								});
								$("#izbrisiZaposlenega-okvir span").html(odgovor.sporocilo);

								timer5 = setTimeout(function() {
					            $("#izbrisiZaposlenega-okvir").hide('slow');
					        	}, 4000);	
				            }else{
				            	clearTimeout(timer5);
				            	$("#izbrisiZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
								$("#izbrisiZaposlenega-okvir").css({
								"display" : ""
								});
								$("#izbrisiZaposlenega-okvir span").text(odgovor.sporocilo);

								timer5= setTimeout(function() {
					            $("#izbrisiZaposlenega-okvir").hide('slow');
					        	}, 4000);	
				            }

					    },
					    error: function (napaka){
					    	clearTimeout(timer5);
					    	$("#izbrisiZaposlenega-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
							$("#izbrisiZaposlenega-okvir").css({
							"display" : ""
							});
							$("#izbrisiZaposlenega-okvir span").text("NAPAKA! Težava z AJAX zahtevkom.");

							timer3 = setTimeout(function() {
				            $("#izbrisiZaposlenega-okvir").hide('slow');
				        	}, 4000);
					    }	
					});	
	    		}
             },
            cancel_callback:    function() { }
        }
    );
}

function pridobiTabeloIdjevZaposlenih(tabelaPozicij){
	var tabelaIdjev=[];
	for(var i=0; i<tabelaPozicij.length; i++){
		tabelaIdjev.push(tabelaIskanihZaposlenih[ tabelaPozicij[i] ].id);
	}
	return tabelaIdjev;
}

function gumb_posljiEmail(){
	$("#poslji-email").click(function(){
		var seznamEmailov=kreirajSeznamMailovZaPosiljanje();
		//console.log(kreirajSeznamMailovZaPosiljanje());
		$("#poslji-email-povezava").attr({
			"href" : "mailto:"+seznamEmailov
		});

		$("#poslji-email-povezava").click();
	});
}

function kreirajSeznamMailovZaPosiljanje(){
	var tabelaIndeksov=[];
    $('#podatkiOZaposlenih input:checked').each(function(){
	       		tabelaIndeksov.push($(this).parent().parent().index());
	});
	console.log("izbrani so " + tabelaIndeksov);
    var seznamMailov="";
    var poz;
    for(var j=0; j<tabelaIndeksov.length;j++){
    	poz=tabelaIndeksov[j];
    	for(var i=0; i< tabelaIskanihZaposlenih[poz].email.length; i++){
    		if(i== tabelaIskanihZaposlenih[poz].email.length-1  && j== tabelaIndeksov.length-1 && tabelaIskanihZaposlenih[poz].email[i]!=undefined){
    			
    			seznamMailov+= tabelaIskanihZaposlenih[poz].email[i];
    			break;
    		}
    		if(tabelaIskanihZaposlenih[poz].email[i]!=undefined){
    			seznamMailov+= tabelaIskanihZaposlenih[poz].email[i]+",";
    		}
    		
    	}
    }
    console.log("Izbrani emaili so: " + seznamMailov);
    return seznamMailov;
}

function naloziCSVDatoteko(){
	$("#uvoziCSV").click(function() {
            $.FileDialog({multiple: false}).on('files.bs.filedialog', function(ev) {
                var files = ev.files;
                //console.log(files);
                var text = "";
                preberiCSV(files[0]);
                /*files.forEach(function(f) {
                    text += f.content + "<br/>";
                });*/
                
                
	            }).on('cancel.bs.filedialog', function(ev) {
	            });
	});
}

 function preberiCSV(csvDatoteka) {
  var reader = new FileReader();
  // Read file into memory as UTF-8      
  reader.readAsText(csvDatoteka);
  // Handle errors load
  reader.onload = loadHandler;
  //reader.onerror = errorHandler;
}

function loadHandler(event) {
  var csv = event.target.result;
  obdelajCSVTextInUvozi(csv);
  //$("#cointainer-telo").html(csv);
}


function obdelajCSVTextInUvozi(csvText){
	var tabela = csvText.split(/,|\n/);
	var tabelaZaposleniZaUvoziti=[];
	
	var stevec=0;
	
	//console.log("TABELA-------------\n\n"+tabela);
	//console.log("VREDNOST tabele na 7 " + tabela[7]);
	for(var i=0; i< tabela.length; i++){
		
		//console.log("tabela na " + i+".mesto ima vrednost\'"+tabela[i]+"\'");
		if(i>= 7){

			if(stevec==0){
				var zaposleniZaUvoziti = {
					ime:"",
					priimek:"",
					tabelaEmailov:[],
					tabelaMobStevilk:[],
					tabelaStacStevilk:[],
				}
				zaposleniZaUvoziti.priimek=tabela[i];
				//console.log("Priimek je "+ tabela[i]);
			}
			if(stevec==1){
				zaposleniZaUvoziti.ime=tabela[i];
				//console.log("Ime je "+ tabela[i]);
			}
			if(stevec==2){
				zaposleniZaUvoziti.tabelaEmailov[0]=tabela[i];
				//console.log("Email je "+ tabela[i]);
			}
			if(stevec==3){
				var objMobSt;
				objMobSt={
					mobSt:tabela[i],
					kratkaMobSt:""
				}	
			}
			if(stevec==4){
				objMobSt.kratkaMobSt=tabela[i];
				zaposleniZaUvoziti.tabelaMobStevilk.push(objMobSt);
			}
			if(stevec==5){
				var objStacSt;
				objStacSt={
					stacSt:tabela[i],
					kratkaStacSt:""
				}
				
			}
			if(stevec==6){
				objStacSt.kratkaStacSt=tabela[i];
				zaposleniZaUvoziti.tabelaStacStevilk.push(objStacSt);

				tabelaZaposleniZaUvoziti.push(zaposleniZaUvoziti);
				console.log(zaposleniZaUvoziti);
				stevec=-1;
			}
			stevec++;
		}
	}
	console.log(tabelaZaposleniZaUvoziti); 

	for(var i=0; i<tabelaZaposleniZaUvoziti.length; i++){

		var ajaxSporocilo={
					ime:tabelaZaposleniZaUvoziti[i].ime,
					priimek:tabelaZaposleniZaUvoziti[i].priimek,
					naslov:"",
					izbiraSkupine:[], 
					delovnoMesto:null,
					tabelaEmailov:tabelaZaposleniZaUvoziti[i].tabelaEmailov,
					tabelaMobStevilk:tabelaZaposleniZaUvoziti[i].tabelaMobStevilk,
					tabelaStacStevilk:tabelaZaposleniZaUvoziti[i].tabelaStacStevilk,
				};

				$.ajax({
				    type: "POST",
				    url: "/registriraj",
				    dataType: 'json',
				    contentType: 'application/json', 
				    async: true,
				    data: JSON.stringify(ajaxSporocilo),

				    success: function (odgovor){
			            odgovor=JSON.parse(odgovor);
				       
				    },
				    error: function (napaka){
				    	
				    }	
				});
	}

}

function gumb_izvoziCSVZIzbranimiZaposlenimi(){
	$("#izvoziCSVIzbranih").click(function(){
		var tabelaIndeksov=[];
	    $('#podatkiOZaposlenih input:checked').each(function(){
	       		tabelaIndeksov.push($(this).parent().parent().index());
	    });
	    var csvText=kreirajCSVDokument(tabelaIndeksov);
	    
	    var filename = 'izvoz.csv';
	    var outputCSV = csvText;
	    var blobby = new Blob(["\ufeff", outputCSV], {type: 'text/plain'});

	    $("#izvoziCSVIzbranih-povezava").attr({
	                'download' : filename,
	                'href': window.URL.createObjectURL(blobby),
	                'target': '_blank'
	                });

	    $("#izvoziCSVIzbranih-povezava").click();
		});	
}

/*function gumb_izvoziCSVZVsemiZaposlenimi(){
	$("#izvoziCSVVseh").click(function(){
		console.log("Zaznan klik na gumb izvozi CSV.");
	    var csvText=kreirajCSVDokument(tabelaIskanihZaposlenih);
	    
	    var filename = 'izvoz.csv';
	    var outputCSV = csvText;
	    var blobby = new Blob(["\ufeff", outputCSV], {type: 'text/plain'});

	    $("#izvoziCSVVseh-povezava").attr({
	                'download' : filename,
	                'href': window.URL.createObjectURL(blobby),
	                'target': '_blank'
	                });

	    $("#izvoziCSVVseh-povezava").click();
		});	
}*/

function kreirajCSVDokument(tabelaIndeksov){
	var csv ='Ime,Priimek,Naslov,Skupina,Del. mesto,E-mail naslovi,Mob. št.,Kratka mob. št.,Stac. št.,Kratka stac. št.\n';
	var poz;
	for(var i=0; i<tabelaIndeksov.length; i++){

		poz= tabelaIndeksov[i];
		csv+= tabelaIskanihZaposlenih[poz].ime+",";
		csv+= tabelaIskanihZaposlenih[poz].priimek+",";
		csv+= tabelaIskanihZaposlenih[poz].naslov+",";
		
		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].skupine.length;j++){
			if(tabelaIskanihZaposlenih[poz].skupine.length-1==j){
				csv+= tabelaIskanihZaposlenih[poz].skupine[j].imeSkupina;
				break;
			}
			csv+= tabelaIskanihZaposlenih[poz].skupine[j].imeSkupina+" ";
		}
		csv+=",";

		csv+= ""+tabelaIskanihZaposlenih[poz].delMesto+",";

		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].email.length; j++){
			if(tabelaIskanihZaposlenih[poz].email.length-1==j){
				csv+= tabelaIskanihZaposlenih[poz].email[j];
				break;
			}
			csv+= tabelaIskanihZaposlenih[poz].email[j] +" ";
		}
		csv+=",";

		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].mobStevilke.length; j++){
			if(tabelaIskanihZaposlenih[poz].mobStevilke.length-1==j){
				csv+= tabelaIskanihZaposlenih[poz].mobStevilke[j].mob_dolga;
				break;
			}
			csv+= tabelaIskanihZaposlenih[poz].mobStevilke[j].mob_dolga+" ";
		}
		csv+=",";

		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].mobStevilke.length; j++){

			if(tabelaIskanihZaposlenih[poz].mobStevilke.length-1==j){
				csv+=tabelaIskanihZaposlenih[poz].mobStevilke[j].mob_kratka;
				break;
			}
			csv+=tabelaIskanihZaposlenih[poz].mobStevilke[j].mob_kratka+" ";
		}
		csv+=",";
		
		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].stacStevilke.length; j++){
			if(tabelaIskanihZaposlenih[poz].stacStevilke.length-1==j){
				csv+=tabelaIskanihZaposlenih[poz].stacStevilke[j].stac_dolga;
				break;
			}
			csv+=tabelaIskanihZaposlenih[poz].stacStevilke[j].stac_dolga+" ";
		}
		csv+=",";

		csv+="";
		for(var j=0; j<tabelaIskanihZaposlenih[poz].stacStevilke.length; j++){
			if(tabelaIskanihZaposlenih[poz].stacStevilke.length-1==j){
				csv+=tabelaIskanihZaposlenih[poz].stacStevilke[j].stac_kratka;
				break;
			}
			csv+= tabelaIskanihZaposlenih[poz].stacStevilke[j].stac_kratka+" ";
		}
		csv+="\n";

	}
	console.log(csv);
	return csv;
}

function testSort(){

	var tabelaZnakov=["a","b","c","č","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","š","t","u","v","z","ž"];

	for(var interval=0; interval<tabelaZnakov.length; interval++){
			for(var i=1; i<tabelaZnakov.length; i++){
				if(tabelaZnakov[i-1].toLowerCase() > tabelaZnakov[i].toLowerCase()){
					temp= tabelaZnakov[i-1];
					tabelaZnakov[i-1]=tabelaZnakov[i];
					tabelaZnakov[i]=temp;
				}
			}
	}
	console.log(tabelaZnakov);
}
//----------------------------------  DODAJANJE NOV VPIS -------------------------------

var mobStevilka = $("#registracija-ime").val();
var mobKratkaStevilka = $("#registracija-priimek").val();
var stacStevilka = $("#registracija-ime").val();
var stacKratkaStevilka = $("#registracija-priimek").val();

function registrirajNovegaZaposlenega(){
	$("#gumb-registriraj").click(function(){
		
		var ime = $("#registracija-ime").val();
		var priimek = $("#registracija-priimek").val();
		var naslov = $("#registracija-naslov").val();

		/* dobili smo pozicije izbranih elementov v tabeli */
		
		var izbiraSkupine = pridobiIndekseIzbranih("registracija-izberiSkupine");	//tabela izbranih skupin
		izbiraSkupine= pridobiTabeloIDjevZaSkupine(izbiraSkupine);

		var delovnoMesto= $('#registracija-delovnoMesto').find(":selected").index();
		delovnoMesto=  pridobiIDZaDelovnoMesto(delovnoMesto);

		var tabelaEmailov =  pridobiEmaile("seznam-emailov");
		var tabelaMobStevilk =  pridobiMobStevilke("seznam-mobStevilk");
		/*for(var i=0; i<tabelaMobStevilk.length; i++){
			console.log("Element v tabeli " +tabelaMobStevilk[i].mobSt);
		}*/
		var tabelaStacStevilk = pridobiStacStevilke("seznam-stacStevilk");

		if(validacijaVnesenihPodatkov(ime,priimek,naslov,izbiraSkupine)){
			
			var ajaxSporocilo={
				ime:ime,
				priimek:priimek,
				naslov:naslov,
				izbiraSkupine:izbiraSkupine, 
				delovnoMesto:delovnoMesto,
				tabelaEmailov:tabelaEmailov,
				tabelaMobStevilk:tabelaMobStevilk,
				tabelaStacStevilk:tabelaStacStevilk,
			};

			$.ajax({
			    type: "POST",
			    url: "/registriraj",
			    dataType: 'json',
			    contentType: 'application/json', 
			    async: true,
			    data: JSON.stringify(ajaxSporocilo),

			    success: function (odgovor){
		            odgovor=JSON.parse(odgovor);
			        if(odgovor.vpisano){
			            clearTimeout(timer3);
			            $("#gumb-registriraj-okvir").attr({"class" : "fade-in obvestilo bg-success"});
						$("#gumb-registriraj-okvir").css({
						"display" : ""
						});
						$("#gumb-registriraj-okvir span").text("Oseba \""+ime+" "+priimek+"\" je bila uspešno vnešena.");

						timer3 = setTimeout(function() {
			            $("#gumb-registriraj-okvir").hide('slow');
			        	}, 4000);	
		            }else{
		            	clearTimeout(timer3);
		            	$("#gumb-registriraj-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
						$("#gumb-registriraj-okvir").css({
						"display" : ""
						});
						$("#gumb-registriraj-okvir span").text(odgovor.sporocilo);

						timer3 = setTimeout(function() {
			            $("#gumb-registriraj-okvir").hide('slow');
			        	}, 4000);	
		            }

			    },
			    error: function (napaka){
			    	clearTimeout(timer3);
			    	$("#gumb-registriraj-okvir").attr({"class" : "fade-in obvestilo bg-danger"});
					$("#gumb-registriraj-okvir").css({
					"display" : ""
					});
					$("#gumb-registriraj-okvir span").text("NAPAKA! Težava z AJAX zahtevkom.");

					timer3 = setTimeout(function() {
		            $("#gumb-registriraj-okvir").hide('slow');
		        	}, 4000);
			    }	
			});

			
		}

		console.log("delovno mesto "+ delovnoMesto);
		console.log("izbira skupine "+ izbiraSkupine);
		console.log("tabela mailov "+ tabelaEmailov);
		console.log("tabela mobilnih stevilk "+tabelaMobStevilk);
		console.log("tabela stacionarnih stevilk "+tabelaStacStevilk);

	});
		
}

/*Iz pozicij izbranih v GUI vmesniku pridobimo dejanske ID-je teh skupin*/
function pridobiTabeloIDjevZaSkupine(tabelaPozicij){
	var tabelaIdjev = [];
	var pozicija=0;
	for(var i=0; i<tabelaPozicij.length;i++){
		pozicija=tabelaPozicij[i];
		tabelaIdjev.push(tabelaSkupin[pozicija].id_skupina);
	}
	return tabelaIdjev;
}

function pridobiIDZaDelovnoMesto(pozicijaDelovnegaMesta){
	var pozicija=pozicijaDelovnegaMesta;
	var idDelovnegaMesta= tabelaDelovnihMest[pozicija].id_del_mesto;

	return idDelovnegaMesta;
}

function validacijaVnesenihPodatkov(ime,priimek,naslov,izbiraSkupine){

	var kontrola1=0,kontrola2=0,kontrola3=0,kontrola4=0;

	if(ime==""){
		$("#registracija-ime").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#registracija-ime").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola1=1;
	}

	if(priimek==""){
		$("#registracija-priimek").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#registracija-priimek").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola2=1;
	}

	if(naslov==""){
		$("#registracija-naslov").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
	}else{
		$("#registracija-naslov").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		kontrola3=1;
	}
	if(izbiraSkupine.length!=0){
		kontrola4=1;
	}else{
		clearTimeout(timer2);
		kontrola=0;
		$("#registracija-izberiSkupine-okvir").css({
			"display" : ""
		});
		timer2 = setTimeout(function() {
            $("#registracija-izberiSkupine-okvir").hide('slow');
        }, 4000);
	}

	if(kontrola1 && kontrola2 && kontrola3 && kontrola4){
		return true;
	}else{
		return false;
	}

}

function pridobiIndekseIzbranih(idSelecta){
	var tabelaIndeksov=[];
    $('#'+idSelecta+' option').each(function(i,v){
        if (this.selected){
        	tabelaIndeksov.push(i);
        } 
    });
    return tabelaIndeksov;
}

function pridobiEmaile(idTabeleEmailov){
	var tabelaEmailov=[];
	var stevec=0;
    $('#'+idTabeleEmailov+' td').each(function(){
    	if(stevec%2==0){
    		tabelaEmailov.push($(this).html());	
    	}
    	stevec++;
    });
    return tabelaEmailov;
}

function pridobiMobStevilke(idTabeleMobStevilk){
	var tabelaMobStevilk=[];
	var stevec=0;

	var podatkiTabele=$("#"+idTabeleMobStevilk).find('td');
	
    for(var i=0; i< podatkiTabele.length; i++){
    	var objekt;

    	if(stevec==0){
	    	objekt={
				mobSt:"",
				kratkaMobSt:""
			}
    		objekt.mobSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==1){
    		objekt.kratkaMobSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==2){
    		tabelaMobStevilk.push(objekt);
    		stevec=-1;
    	}
    	stevec++;
    }

	return tabelaMobStevilk;
    
}

function pridobiStacStevilke(idTabeleStacStevilk){
	var tabelaStacStevilk=[];
	var stevec=0;

    var podatkiTabele=$("#"+idTabeleStacStevilk).find('td');
	
    for(var i=0; i< podatkiTabele.length; i++){
    	var objekt;

    	if(stevec==0){
	    	objekt={
				stacSt:"",
				kratkaStacSt:""
			}
    		objekt.stacSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==1){
    		objekt.kratkaStacSt=$(podatkiTabele[i]).text();
    	}
    	if(stevec==2){
    		tabelaStacStevilk.push(objekt);
    		stevec=-1;
    	}
    	stevec++;
    }

	return tabelaStacStevilk;
}



function prikaziSkupine(idSelecta){
	//console.log("Deluje test test test");
	$("#"+idSelecta).html("");
	tabelaSkupin = pridobiVseSkupine();
	for(var i=0; i<tabelaSkupin.length; i++){
		$("#"+idSelecta).append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
	}
	
}

function prikaziDelovnaMesta(){
	//console.log("Deluje test test test");
	$("#registracija-delovnoMesto").html("");
	for(var i=0; i<tabelaDelovnihMest.length; i++){
		$("#registracija-delovnoMesto").append("<option>"+tabelaDelovnihMest[i].ime_del_mesto+"</option>");
	}
	
}

function dodajanjeEmailov(){
	$("#dodajEmail-gumb").click(function(){

		var email=$("#dodajEmail").val();

		if(email.indexOf("@")>-1 && email!=""){
			$("#registracija-emailNaslov").attr({"class" : "input-group col-xs-12 col-sm-12"});

			var html="<tr style=\"border:0;\">" +
                 "   <td>"+email+"</td>" +
                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#seznam-emailov").append(html);
		}else{
			$("#registracija-emailNaslov").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}
		
		
	});
	
}

function dodajanjeMobStevilk(){
	$("#dodajMobStevilko-gumb").click(function(){
		var mobStevilka=$("#dodajMobStevilko").val();
		var kratkaMobStevilka=$("#dodajKratkoMobStevilko").val();
		var kontrola1=0,kontrola2=0;

		if(mobStevilka!=""){
			kontrola1=1;
			$("#dodajMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#dodajMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kratkaMobStevilka!=""){
			kontrola2=1;
			$("#dodajKratkoMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#dodajKratkoMobStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kontrola1 && kontrola2){
			var html="<tr style=\"border:0;\">" +
		                 "   <td>"+mobStevilka+"</td>" +
		                 "   <td>"+kratkaMobStevilka+"</td>" +
		                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#seznam-mobStevilk").append(html);
		}
		
	
	});
	
}

function dodajanjeStacStevilk(){
	$("#dodajStacStevilko-gumb").click(function(){
		var stacStevilka=$("#dodajStacStevilko").val();
		var kratkaStacStevilka=$("#dodajKratkoStacStevilko").val();

		var kontrola1=0,kontrola2=0;

		if(stacStevilka!=""){
			kontrola1=1;
			$("#dodajStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#dodajStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kratkaStacStevilka!=""){
			kontrola2=1;
			$("#dodajKratkoStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
		}else{
			$("#dodajKratkoStacStevilko").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
		}

		if(kontrola1 && kontrola2){
			var html="<tr style=\"border:0;\">" +
	                 "   <td>"+stacStevilka+"</td>" +
	                 "   <td>"+kratkaStacStevilka+"</td>" +
	                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
			$("#seznam-stacStevilk").append(html);
		}

	});
	
}

function brisanjeVrsticPriRegistraciji(){
	$(document).on('click', '.registracija', function(){
		console.log("zaznal sem!");
		$(this).parent().parent().remove();

	});	

}

function obvestiloNiEmailov(){
	var stVrstic = $('#myTable tr').length;
}
//----------------------------------  DODAJANJE SKUPINE -------------------------------
function gumbDodajNovoSkupino(){
	$("#dodajSkupino-gumb").click(function(){

		var imeNoveSkupine= $("#imeNoveSkupine").val();
		dodajNovoSkupino(imeNoveSkupine);
		prikaziSkupine("registracija-izberiSkupine");
		prikaziSkupineDomov();
	});
}

function dodajNovoSkupino(imeNoveSkupine){

	var zahtevek={
		imeSkupine: imeNoveSkupine
	}

	$.ajax({
		    type: "POST",
		    url: "/dodajSkupino",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify(zahtevek),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                if(odgovor.vpisano){
	                	clearTimeout(timer);
						$("#dodajSkupino-okvir").css({display: ""});	
			    		$("#dodajSkupino-okvir").css({
	                    "display": "inline-block"
		                });
		                $("#dodajSkupino-okvir").attr({
		                    "class": "alert alert-success fade-in"
		                });
		                $("#dodajSkupino").html("Skupina \""+imeNoveSkupine+"\" uspešno dodana.");
		                pridobiVseSkupine();
		                timer = setTimeout(function() {
		                    $("#dodajSkupino-okvir").hide('slow');
		                }, 4000);
			    	}else{
			    		$("#dodajSkupino-okvir").css({
	                    "display": "inline-block"
		                });
		                $("#dodajSkupino-okvir").attr({
		                    "class": "alert alert-danger fade-in"
		                });
		                $("#dodajSkupino").html(odgovor.sporocilo);
		                timer = setTimeout(function() {
		                    $("#dodajSkupino-okvir").hide('slow');
		                }, 4000);
		    	}
	                
		    }
		});
}

function pridobiVseSkupine(){
	
	$.ajax({
		    type: "POST",
		    url: "/seznamSkupin",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: false,
		    data: JSON.stringify({}),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                //console.log("Tabela "+odgovor.podatki);
	                //tabelaSkupin = odgovor.podatki;
	                tabelaSkupin = obrniVrstniRedElementovVTabeli(odgovor.podatki);
	                izpisiVseSkupine(tabelaSkupin);
	                console.log("Korak1");

		    }
	});
	console.log("Korak2");
	return tabelaSkupin; 
	
}

function obrniVrstniRedElementovVTabeli(tabela){
	var temp;
	for(var i=0; i<tabela.length; i++){
		if(tabela.length-1-i == i){
			break;
		}
		temp=tabela[i];
		tabela[i]=tabela[tabela.length-1-i];
		tabela[tabela.length-1-i]=temp;
		if(tabela.length-1-2*i==1){
			break;
		}
	}
	return tabela;
}

function izpisiVseSkupine(tabelaSkupin){

	$("#seznam-skupin").html("");
	//console.log("V tabeli je " + tabela.length +" elementov.")
	var html=""+
				"<tr>"+
				"	<td>V pod. bazi ni nobenih skupin.</td>"+
				"	<td>"+
				"		"+
				"	</td>"+
				"</tr>";

	for(var i=0; i<tabelaSkupin.length; i++ ){
		if(i==0){
			html="";
		}
		    
		html=html+"<tr>"+
			"	<td>"+tabelaSkupin[i].ime_skupina+"</td>"+
			"	<td>"+
			"		<span class=\"glyphicon glyphicon-trash\" style=\"float:right;\"></span>"+
			"	</td>"+
			"</tr>";                             
                                    
                                 
	}
	$("#seznam-skupin").append(html);
}

/*function sortirajPoImenuSkupine(){
	$("#sortirajPoImenuSkupine").click(function(){
		var temp;
		for(var interval=0; interval<tabelaSkupin.length; interval++){
			for(var i=1; i<tabelaSkupin.length; i++){
				if(tabelaSkupin[i-1].ime_skupina > tabelaSkupin[i].ime_skupina){
					temp= tabelaSkupin[i-1];
					tabelaSkupin[i-1]=tabelaSkupin[i];
					tabelaSkupin[i]=temp;
				}
			}
		}
		izpisiVseSkupine(tabelaSkupin);
		prikaziSkupine("registracija-izberiSkupine");
		prikaziSkupineDomov();
	});
}*/

function gumbOsveziSkupine(){
	$("#gumb-osvezi").click(function(){
		pridobiVseSkupine();
		prikaziSkupine("registracija-izberiSkupine");
	});
}

function gumb_izbrisiSkupino(){
	/*$(".glyphicon-trash").click(function(){
		console.log("Zaznan je bil klik na smetnjak");
		$(this).css({"display" : "none"});
	});*/


	$(document).on('click', '#seznam-skupin .glyphicon-trash', function () {
	   	
		var indeks = $(this).parent().parent().index();
		izbrisiSkupino(tabelaSkupin[indeks].id_skupina);
		console.log(tabelaSkupin);
	});


}

function izbrisiSkupino(idSkupine){

	var ajaxZahtevek={
		idSkupine : idSkupine
	}

	$.ajax({
		    type: "POST",
		    url: "/izbrisiSkupino",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify(ajaxZahtevek),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                if(odgovor.uspeh){
	                	$("#gumb-osvezi").click();	
	                	prikaziSkupine("registracija-izberiSkupine");
	                	prikaziSkupineDomov();
	                	urediZaposlenega_prikaziSkupine("urediZaposlenega-izberiSkupine");
	                }
	                
		    }
		});
}

//----------------------------------  DODAJANJE DELOVNEGA MESTA -------------------------------

function gumbDodajNovoDelovnoMesto(){
	$("#dodajDelovnoMesto-gumb").click(function(){

		var imeNovegaDelovnegaMesta= $("#imeNovegaDelovnegaMesta").val();
		dodajNovoDelovnoMesto(imeNovegaDelovnegaMesta);
		prikaziDelovnaMesta();
	});
}

function dodajNovoDelovnoMesto(imeDelovnegaMesta){

	var zahtevek={
		imeNovegaDelovnegaMesta: imeDelovnegaMesta
	}

	$.ajax({
		    type: "POST",
		    url: "/dodajDelovnoMesto",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify(zahtevek),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                if(odgovor.vpisano){
	                	clearTimeout(timer1);
						$("#dodajDelovnoMesto-okvir").css({display: ""});
			    		$("#dodajDelovnoMesto-okvir").css({
	                    "display": "inline-block"
		                });
		                $("#dodajDelovnoMesto-okvir").attr({
		                    "class": "alert alert-success fade-in"
		                });
		                $("#dodajDelovnoMesto").html("Delovno mesto \""+imeDelovnegaMesta+"\" uspešno dodano.");
		                pridobiVsaDelovnaMesta();
		                timer1 = setTimeout(function() {
		                    $("#dodajDelovnoMesto-okvir").hide('slow');
		                }, 4000);
			    	}else{
			    		$("#dodajDelovnoMesto-okvir").css({
	                    "display": "inline-block"
		                });
		                $("#dodajDelovnoMesto-okvir").attr({
		                    "class": "alert alert-danger fade-in"
		                });
		                $("#dodajDelovnoMesto").html(odgovor.sporocilo);
		                timer1 = setTimeout(function() {
		                    $("#dodajDelovnoMesto-okvir").hide('slow');
		                }, 4000);
		    	}
	                
		    }
		});
}

function pridobiVsaDelovnaMesta(){

	$.ajax({
		    type: "POST",
		    url: "/seznamDelovnihMest",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: false,
		    data: JSON.stringify({}),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                tabelaDelovnihMest=obrniVrstniRedElementovVTabeli(odgovor.podatki);
	                izpisiVsaDelovnaMesta(tabelaDelovnihMest);

		    }
	});
	
}
function gumbOsveziDelovnaMesta(){
	$("#gumb-osvezi-del-mesta").click(function(){
		pridobiVsaDelovnaMesta();
		prikaziDelovnaMesta();
	});
}


function gumb_izbrisiDelovnoMesto(){

	$(document).on('click', '#seznamDelovnihMest .glyphicon-trash', function () {
	   	
		var indeks = $(this).parent().parent().index();
		izbrisiDelovnoMesto(tabelaDelovnihMest[indeks].id_del_mesto);
		console.log(tabelaDelovnihMest);
	});


}

function izbrisiDelovnoMesto(idDelMesto){

	var ajaxZahtevek={
		idDelMesto : idDelMesto
	}

	$.ajax({
		    type: "POST",
		    url: "/izbrisiDelovnoMesto",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify(ajaxZahtevek),

		    success: function (odgovor){
	                odgovor=JSON.parse(odgovor);
	                if(odgovor.uspeh){
	                	$("#gumb-osvezi-del-mesta").click();	
	                	prikaziDelovnaMesta();
						urediZaposlenega_prikaziDelovnaMesta();
	                }
	                
		    }
		});
}

function izpisiVsaDelovnaMesta(tabelaDelovnihMest){

	$("#seznamDelovnihMest").html("");
	//console.log("V tabeli je " + tabela.length +" elementov.")
	var html=""+
				"<tr>"+
				"	<td>V pod. bazi ni nobenih delovnih mest.</td>"+
				"	<td>"+
				"		"+
				"	</td>"+
				"</tr>";

	for(var i=0; i<tabelaDelovnihMest.length; i++ ){
		if(i==0){
			html="";
		}
		    
		html=html+"<tr>"+
			"	<td>"+tabelaDelovnihMest[i].ime_del_mesto+"</td>"+
			"	<td>"+
			"		<span class=\"glyphicon glyphicon-trash\" style=\"float:right;\"></span>"+
			"	</td>"+
			"</tr>";                             
                                    
                                 
	}
	$("#seznamDelovnihMest").append(html);
}

/*
function sortirajPoImenuDelovnegaMesta(){
	$("#sortirajPoImenuDelovnegaMesta").click(function(){
		var temp;
		for(var interval=0; interval<tabelaDelovnihMest.length; interval++){
			for(var i=1; i<tabelaDelovnihMest.length; i++){
				if(tabelaDelovnihMest[i-1].ime_del_mesto > tabelaDelovnihMest[i].ime_del_mesto){
					temp= tabelaDelovnihMest[i-1];
					tabelaDelovnihMest[i-1]=tabelaDelovnihMest[i];
					tabelaDelovnihMest[i]=temp;
				}
			}
		}
		izpisiVsaDelovnaMesta(tabelaDelovnihMest);
	});
}*/

function izpisiTabelo(tabela){
	for(var i=0; i<tabela.length; i++){
		console.log(tabela[i]);
	}
}



function izberiZavihek(){

		$(".kategorija").click(function() {
					
			$(".kategorija").css({"background-color" : "#333"});
				
			$(this).css({"background-color" : "#111"});

			if($(this).attr("id")=="povezava-Domov"){
				$(".menu").css({"display" : "none"});
				$("#domov").css({"display" : ""});
			}
			if($(this).attr("id")=="povezava-DodajNovVpis"){

				$(".menu").css({"display" : "none"});
				$("#dodajNovVpis").css({"display" : ""});
			}
			if($(this).attr("id")=="povezava-Skupine"){
				
				$(".menu").css({"display" : "none"});
				$("#skupine").css({"display" : ""});
			}
			if($(this).attr("id")=="povezava-Podrobnosti"){
				
				$(".menu").css({"display" : "none"});
				$("#podrobnosti").css({"display" : ""});
			}
			
				
		});

		$("#glava-naslov").click(function() {

			$(".kategorija").css({"background-color" : "#333"});
			$("#povezava-Domov").css({"background-color" : "#111"});
			$(".menu").css({"display" : "none"});
			$("#domov").css({"display" : ""});
		
		});
}

function skrijIskalnik(){
	
	$("#skrij-iskalnik").click( function() {
		
		$("#iskalnik").fadeToggle();

		if( $("#skrij-iskalnik").attr("class") == "glyphicon glyphicon-chevron-up" ){
			$("#skrij-iskalnik").attr({
                "class" : "glyphicon glyphicon-chevron-down"
            });
		}else{
			$("#skrij-iskalnik").attr({
                "class" : "glyphicon glyphicon-chevron-up"
            });
		}
	});
}

function oznaciVse(){
	$("#oznaci-vse").click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked);
});
}
