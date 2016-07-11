$(document).ready(function() {
  odjavaUporabnika();
});


function odjavaUporabnika() {
	$("#gumb-odjava").click(function(){

		var sporociloOdjava ={
			odjava : true
		}
		console.log(JSON.stringify(sporociloOdjava));
	    $.ajax({
		    type: "POST",
		    url: "/odjava",
		    dataType: 'json',
		    contentType: 'application/json', 
		    async: true,
		    data: JSON.stringify(sporociloOdjava),

		    success: function (odgovor){
	                window.location.replace("/");
		    }
		});
	});
	

}