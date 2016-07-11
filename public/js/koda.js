$(document).ready(function(){
	izberiZavihek();
	skrijIskalnik();
	oznaciVse();
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
