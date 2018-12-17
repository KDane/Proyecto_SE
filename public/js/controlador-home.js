var db; //variable global

(function(){
    if (!('indexedDB' in window)){
        console.err("El navegador no soporta indexedDB");
        return;
    }

    var solicitud = window.indexedDB.open("kasi", 1);//Parametros: nombre, version. La version debe ser entero
    
    //Se ejecutara en caso de que pueda abrir la BD sin problemas
    solicitud.onsuccess = function(evento){
        console.log("Se abrio la base de datos");
        db = solicitud.result;
        //Leer la informacion del objectstore e imprimirla en la tabla html
        llenarListaCarpetas();
        
    };
    

    //Se ejecutar en caso no se pueda abrir la base de datos
    solicitud.onerror = function(evento){
        console.err("No se pudo abrir la base datos");
    };

    //Se ejecutara cuando NO exista la base de datos o se necesite actualizar
    solicitud.onupgradeneeded = function(evento){
        console.log("La base de datos se creara");
        db = evento.target.result; //Obteniendo la refencia la base de datos creada (facebook)
        var objectStoreCarpetas = 
        db.createObjectStore("carpetas", {keyPath: "codigo", autoIncrement: true});

        objectStoreCarpetas.transaction.oncomplete = function(evento){
            console.log("El object store de usuarios se creo con exito");
        }

        objectStoreCarpetas.transaction.onerror = function(evento){
            console.log("Error al crear el object store de usuarios");
        }
    
    }
    
})();



function registrarCarpetas(){
        var carpeta = {};
        carpeta.nombre =  document.getElementById("nombreC").value;
        carpeta.fecha =  document.getElementById("fecha-creacionC").value;
        
        ///Guardar informacion en el objectstore de usuarios de la base de datos de facebook
        var transaccion = db.transaction(["carpetas"],"readwrite");///readwrite: Escritura/lectura, readonly: Solo lectura
        var objectStorePosts = transaccion.objectStore("carpetas");
        var solicitud = objectStorePosts.add(carpeta);
        solicitud.onsuccess = function(evento){
            console.log("Se agrego lacarpeta correctamente");
            llenarListaCarpetas();
            $('#modal-carpeta').modal('hide');
        }

        solicitud.onerror = function(evento){
            console.log("Ocurrio un error al guardar");
        }
        console.log(carpeta);
}








function llenarListaCarpetas(){
    document.getElementById("lista-carpetas").innerHTML="";

    //Leer el objectstore de usuarios para imprimir la informacion, debe ser en este punto porque esta funcion se ejecuta si se abrio la BD correctamente
    var transaccion = db.transaction(["carpetas"],"readonly");///readwrite: Escritura/lectura, readonly: Solo lectura
    var objectStorePosts = transaccion.objectStore("carpetas");
    var cursor = objectStorePosts.openCursor();
    cursor.onsuccess = function(evento){
        //Se ejecuta por cada objeto del objecstore
        if(evento.target.result){
            console.log(evento.target.result.value);
            var carpeta = evento.target.result.value;
            if (document.getElementById("lista-carpetas") !=null)
                document.getElementById("lista-carpetas").innerHTML += 
                        '<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">'+
                        '<div class="carpeta"><img src="img/carpeta.png" class="img-thumbnail">'+
                        '<b><h3>'+carpeta.nombre+'</b></h3><br><small class="text-muted">'+carpeta.fecha+'</small>'+
                        '<br><button type="button" onclick="eliminarPost('+carpeta.codigo+')" class="btn btn-outline-primary"><i class="fas fa-trash-alt"></i></button></div></div>';
 
            evento.target.result.continue();
        }
    }
}


function eliminarPost(codigocarpeta){
    console.log("Eliminar post con codigo: " + codigocarpeta);
        var solicitud = 
            db.transaction(["carpetas"],"readwrite")
            .objectStore("carpetas")
            .delete(codigocarpeta);
            
        solicitud.onsuccess = function(evento){
            console.log("Se elimino el post con codigo: " + codigocarpeta);
            llenarListaPosts();
        }
}