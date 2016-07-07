$(document).ready(function(){
	izberiZavihek();
});

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
			
				
		});

		$("#glava-naslov").click(function() {

			$(".kategorija").css({"background-color" : "#333"});
			$("#povezava-Domov").css({"background-color" : "#111"});
			$(".menu").css({"display" : "none"});
			$("#domov").css({"display" : ""});
		
		});
}
