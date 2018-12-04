$("#btn-login").click(function(){
    console.log($("#formulario").serialize());
    $.ajax({
        url:"/login",
        method:"POST",
        data:$("#formulario").serialize(),
        dataType:"json",
        success:function(resp){
            console.log(resp);
            if (resp.length==1)
                window.location.href = "./Home.html";
            else 
                alert("Credenciales invalidas");
        },
        error:function(error){
            console.error(error);
        }
    });

});