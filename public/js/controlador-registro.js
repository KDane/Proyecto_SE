$(document).ready(function(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-plan",
        dataType:"json",
        method:"get",
		success:function(res){
			console.log(res);
			for(var i=0; i<res.length; i++){
				$("#slc-plan").append('<option value="'+res[i].idPlan+'">'+res[i].Nombre_Plan+'</option>');
			}
		}
	});

});