$("#slc-usuario").change(function(){
	//alert("USUARIO seleccionado: " + $("#slc-usuario").val());
});

$(document).ready(function(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-plan",
		method: "GET",
        dataType:"json",
		success:function(res){
			console.log(res);
			for(var i=0; i<res.length; i++){
				$("#slc-plan").append('<option value="'+res[i].idPlan+'">'+res[i].Nombre_Plan+'</option>');
			}
		},
		error:function(error){
			console.error(error);
		}
		
	});

});


$("#btn-registrar").click(function(){
	var parametros = `nombre=${$("#nombre").val()}&apellido=${$("#apellido").val()}&correo=${$("#correo").val()}&contrasena=${$("#contrasena").val()}&urlImagen=${$("#urlImagen").val()}&idPlan=${$("#slc-plan").val()}`;
	console.log(parametros);
	$.ajax({
		url:"/registrar",
		method:"POST",
		data: parametros,
		dataType:"json", 
		success: function(respuesta){ 
			console.log(respuesta);
			    window.location.href ="LandingPage.html";
		},
		error:function(error){
			console.error(error);
		}
	});
});

/*function Validar(){
	var nombre = document.getElementById('nombre').value;
	var apellido= document.getElementById('apellido').value;
	var correo = document.getElementById('correo').value;
	var contrasena = document.getElementById('contrasena').value;
	
	if(nombre=""){
		$('alert').html('Debe ingresar su nombre').slideDown(500);
		$('#nombre').focus();
		return false;
	}
	else{
		$('alert').html('').slideDown(300);
	}
	if(apellido=""){
		$('alert').html('Debe ingresar su apellido').slideDown(500);
		$('#apellido').focus();
		return false;
	}
	else{
		$('alert').html('').slideDown(300);
	}
	if(correo=""){
		$('alert').html('Debe ingresar el correo').slideDown(500);
		$('#correo').focus();
		return false;
	}
	else{
		$('alert').html('').slideDown(300);
	}
	if(contrasena=""){
		$('alert').html('Debe ingresar la contraseña').slideDown(500);
		$('#contrasena').focus();
		return false;
	}
	else{
		$('alert').html('').slideDown(300);
	}
		
}

*/

