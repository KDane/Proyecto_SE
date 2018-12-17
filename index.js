var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();

var credenciales ={
  user:"root",
  password:"",
  database:"bd_proyecto",
  host:"localhost",
  port:"3306"  
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static("public"));
app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));

//Verificar si existe una variable de sesion para poner publica la carpeta public admin
var publicbasico = express.static("public-basico");
var publicestandar = express.static("public-estandar");
var publicpremium = express.static("public-premium");


app.use(
    function(req,res,next){
        if (req.session.correoUsuario){
            if (req.session.idPlanUsuario == 1)
                publicbasico(req,res,next);
            else if (req.session.idPlanUsuario == 2)
                publicestandar(req,res,next);
                else if (req.session.idPlanUsuario == 3)
                publicpremium(req,res,next);
        }
        else
            return next();
    }
);


//Login
app.post("/login",function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT idUsuario, Correo, idPlan FROM usuario WHERE  contrasena = sha1(?) and correo=?",
        [req.body.contrasena, req.body.correo],
        function(error, data, fields){
            if (error){
                res.send(error);  
                res.end();
            }else{
                if (data.length==1){
                    req.session.idUsuario = data[0].idUsuario; 
                    req.session.correoUsuario = data[0].Correo;
                    req.session.idPlanUsuario = data[0].idPlan;
                }
                res.send(data);
                res.end();
            }
        }
    )
});

//Obteniendo la session 
app.get("/obtener-session",function(req,res){
    res.send( "Codigo Usuario: " + req.session.idUsuario+
            ", Correo: " + req.session.correoUsuario +
            ", Tipo Usuario: " + req.session.idPlanUsuario
    );
    res.end();
});


//Salir
app.get("/cerrar-session",function(req,res){
    req.session.destroy();
    res.send("Sesion eliminada");
    res.send("Debe loguearse de nuevo, si desea volver a entrar.")
    res.write("body{background-color:black;color:white;}");
    res.end();
});


//Probando obtener planes
app.get("/obtener-plan", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    var sql= "SELECT idPlan, Nombre_Plan, Espacio_Tiempo  FROM plan";
    var planes = []; 
    conexion.query(sql)
    .on("result", function(resultado){
        planes.push(resultado);
    })
    .on("end",function(){
        res.send(planes);
    }); 
});

//Probando obtener los usuario
app.get("/obtener-usuarios", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = "SELECT idUsuario, Nombre, Apellido, Correo, Contrasena, Imagen, idPlan FROM usuario";
    var usuarios = [];
    conexion.query(sql)
    .on("result", function(resultado){
        usuarios.push(resultado);
    })
    .on("end",function(){
        response.send(usuarios);
    });   
});


//Registro de usuarios
app.post("/registrar", function(req, res){
    var conexion= mysql.createConnection(credenciales);
    conexion.query(
        "INSERT INTO usuario(Nombre, Apellido, Correo, Contrasena, urlImagen, idPlan) VALUES (?,?,?,sha1(?),?,?)",
        [
            req.body.nombre,
            req.body.apellido,
            req.body.correo,
            req.body.contrasena,
            req.body.urlImagen,
            req.body.idPlan

        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }

    );

})




app.listen(8111);