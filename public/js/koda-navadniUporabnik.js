
var timer,timer1,timer2,timer3,timer4,timer5;
var tabelaSkupin=[];	
var tabelaDelovnihMest=[];

var tabelaIskanihZaposlenih = [];

var idTrenutnegaObravnavanegaZaposlenega;

$(document).ready(function(){

	testirajAplikacijo();
	skrijIskalnik();
	oznaciVse();

	//------------ DOMOV ------------------

	prikaziSkupineDomov();
	isciZaposlene();
	sortirajTabeloZaposlenih();

	gumb_posljiEmail();
	
});


//---------------------------------- DOMOV -------------------------------------

function testirajAplikacijo(){
	console.log("Povezava z bazo: " + testPovezaveSPodatkovnoBazo());
	$('#pojavnoOkno-testAplikacija').modal('show');
	setTimeout(function(){
		if(testPovezaveSPodatkovnoBazo()){

		$('#pojavnoOkno-testAplikacija').modal('hide');
		}else{
			window.location.replace("/napaka");
		}
	}, 500);

	

}

function testPovezaveSPodatkovnoBazo(){
	var status=false;
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
	                status=odgovor.uspeh;

		    }
	});

	return status; 
}

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

function pridobiIndekseIzbranih(idSelecta){
	var tabelaIndeksov=[];
    $('#'+idSelecta+' option').each(function(i,v){
        if (this.selected){
        	tabelaIndeksov.push(i);
        } 
    });
    return tabelaIndeksov;
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
             html+= "</tr>";
                    

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
