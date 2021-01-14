//Grupo 21
//          Joel  Garcia Aparicio
//          Pedro Sánchez Escribano
"use strict";
//  Modulos propios

//  Configuracion de la conexion a la base de datos y puerto de escucha del serrvidor.
const config = require("./config");
const DAOUser = require("./models/modelUsers");

//  Modulos de node
const mysql = require("mysql");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

//Routers CuatroZeroCuatroApp.
const routerPreSLogin = require("./routers/routerPreLogin");
const routerUsers = require("./routers/routerUsers");
const routerQuestions = require("./routers/routerQuestions")
//Express.
const app = express();

//Configuramos la BBDD para que almacene la sesion de usuario
const mysqlStore = mysqlSession(session);
const sessionStore = new mysqlStore(config.mysqlConfig);

//El modulo de morgan devuelve un middleware que muestra por consola las peticiones tanto GET COMO POST
app.use(morgan("dev"));

//Objeto de sesion de usuario.
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

//Motor de plantillas y ubicacion de vistas.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Obtener la ruta dentro del proyecto de los ficheros estaticos.
const fEstaticos = path.join(__dirname, "public");

//Compruebas si se solicitan recursos estaticos y si es asi devuelve
app.use(express.static(fEstaticos));

//Middleware para el uso de los mensajes Flash.
app.use(function(request, response, next) {

    // Podemos acceder a los mensajes flash a partir del objeto response en la cadena de middlewares
    // SetFlash hace un set del mensaje dentro del a sesion del usuario

    response.setFlash = function(message) {
        request.session.flashMsg = message;
    };
    // En locals podemos acumular cualquier dato ( solo existe en el servidor)
    // Accedemos al mensaje a partir de locals -> lo recogemos y lo limpiamos
    response.locals.getCleanFlash = function() {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };

    next();

});

//Crea el objeto session dentro del objeto request.
app.use(middlewareSession);

//Middleware body-parser para acceder a las variables del cuerpo de la peticion (request.body)
app.use(bodyParser.urlencoded({ extended: false }));

//Router que gestiona las rutas que no requieren que el usuario haya iniciado sesion.
app.use("/usuarios", routerPreSLogin);

//Middleware de control de sesion.
app.use(function (request, response, next) {

    if (request.session.user !== undefined) {

        response.locals.user= request.session.user;
        next();
    } else {
        response.status(200);
        response.render("index", {errorMsg: "Identifíquese para continuar."});
    }

});

//Routers que gestionan rutas que requieren que el usuario este validado.
app.use("/usuarios", routerUsers);
app.use("/preguntas", routerQuestions);

//Inicializacion del Servidor indicando el puerto en el cual funciona
app.listen(config.port, function (err) {

    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }

});

//Middleware para el control de errores , en concreto el error 404 que se da cuando no se encuentra el recurso.
app.use(function(request, response, next) {
    response.status(404);
    response.render("404", { urlNotFound: request.url });
});

//Middleware para el control de errores , en concreto el error 500 que se da cuando ocurre un error interno de la app
app.use(function(request, response, next) {
    response.status(500);
    response.render("500", { msgText: request.message });
});



