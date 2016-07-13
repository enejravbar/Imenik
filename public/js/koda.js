
var timer,timer1;
var tabelaSkupin=[];	
var tabelaDelovnihMest=[];

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

	// ----------- DODAJ NOV VPIS -------------
	prikaziSkupine();
	dodajanjeEmailov();
	dodajanjeMobStevilk();
	dodajanjeStacStevilk();
	brisanjeVrsticPriRegistraciji();
	prikaziDelovnaMesta();
	registrirajNovegaZaposlenega();

});

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
		var delovnoMesto= $('#registracija-delovnoMesto').find(":selected").index();
		var izbiraSkupine = pridobiIndekseIzbranih("registracija-izberiSkupine");	//tabela izbranih skupin

		var tabelaEmailov =  pridobiEmaile("seznam-emailov");
		var tabelaMobStevilk =  pridobiEmaile("seznam-emailov");
		console.log("delovno mesto "+ delovnoMesto);
		console.log("izbira skupine "+ izbiraSkupine);
		console.log("tabela mailov "+ tabelaEmailov);

	});
		
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
	
	var objekt={
		mobSt:"",
		kratkaMobSt:""
	}

    $('#'+idTabeleMobStevilk+' td').each(function(){
    	if(stevec==0){
    		objekt.mobSt=$(this).html();
    	}
    	if(stevec==1){
    		objekt.kratkaMobSt=$(this).html();
    	}
    	if(stevec==2){
    		tabelaMobStevilk.push(objekt);	
    		stevec==0;
    	}
    	stevec++;
    });
    return tabelaMobStevilk;
}



function prikaziSkupine(){
	//console.log("Deluje test test test");
	$("#registracija-izberiSkupine").html("");
	tabelaSkupin = pridobiVseSkupine();
	for(var i=0; i<tabelaSkupin.length; i++){
		$("#registracija-izberiSkupine").append("<option>"+tabelaSkupin[i].ime_skupina+"</option>");
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
		var html="<tr style=\"border:0;\">" +
                 "   <td>"+email+"</td>" +
                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
		$("#seznam-emailov").append(html);
		
	});
	
}

function dodajanjeMobStevilk(){
	$("#dodajMobStevilko-gumb").click(function(){
		var mobStevilka=$("#dodajMobStevilko").val();
		var kratkaMobStevilka=$("#dodajKratkoMobStevilko").val();

		var html="<tr style=\"border:0;\">" +
                 "   <td>"+mobStevilka+"</td>" +
                 "   <td>"+kratkaMobStevilka+"</td>" +
                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
		$("#seznam-mobStevilk").append(html);
	
	});
	
}

function dodajanjeStacStevilk(){
	$("#dodajStacStevilko-gumb").click(function(){
		var stacStevilka=$("#dodajStacStevilko").val();
		var kratkaStacStevilka=$("#dodajKratkoStacStevilko").val();

		var html="<tr style=\"border:0;\">" +
                 "   <td>"+stacStevilka+"</td>" +
                 "   <td>"+kratkaStacStevilka+"</td>" +
                 "   <td><span class=\"glyphicon glyphicon-trash registracija\" style=\"float:right;\"></span></td> </tr>";
		$("#seznam-stacStevilk").append(html);

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

	for(var i=0; i<tabelaSkupin.length-1; i++ ){
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

function gumbOsveziSkupine(){
	$("#gumb-osvezi").click(function(){
		pridobiVseSkupine();
	});
}

//----------------------------------  DODAJANJE DELOVNEGA MESTA -------------------------------

function gumbDodajNovoDelovnoMesto(){
	$("#dodajDelovnoMesto-gumb").click(function(){

		var imeNovegaDelovnegaMesta= $("#imeNovegaDelovnegaMesta").val();

		dodajNovoDelovnoMesto(imeNovegaDelovnegaMesta);
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

	for(var i=0; i<=tabelaDelovnihMest.length-1; i++ ){
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
