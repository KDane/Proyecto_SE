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
var publicAdmin = express.static("public-basico");
var publicCajero = express.static("public-estandar");


app.use(
    function(req,res,next){
        if (req.session.correoUsuario){
            //Significa que el usuario si esta logueado
            if (req.session.idPlanUsuario == 1)
                publicbasico(req,res,next);
            else if (req.session.idPlanUsuario == 2)
                publicestandar(req,res,next);
        }
        else
            return next();
    }
);



app.post("/login",function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT idUsuario, Correo, idPlan FROM usuario WHERE  Correo=? and Contrasena = sha1(?)",
        [req.body.correo, req.body.contrasena],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                if (data.length==1){
                    req.session.idUsuarioN = data[0].idUsuario;
                    req.session.correoUsuario = data[0].Correo;
                    req.session.idPlanUsuario = data[0].idPlan;
                }
                res.send(data);
                res.end();
            }
        }
    )
});

app.get("/obtener-session",function(req,res){
    res.send("Codigo Usuario: " + req.session.idUsuarioN+
            ", Correo: " + req.session.correoUsuario +
            ", Tipo Usuario: " + req.session.idPlanUsuario
    );
    res.end();
});


//salir
app.get("/cerrar-session",function(req,res){
    req.session.destroy();
    res.send("Sesion eliminada");
    res.end();
});


app.listen(8111);