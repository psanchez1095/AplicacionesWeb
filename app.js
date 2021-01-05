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

// Declaracion de los Routers de la aplicacion.
const routerPreSLogin = require("./routers/routerPreLogin");
const routerUsers = require("./routers/routerUsers");
const routerQuestions= require("./routers/souterQuestions");
const routerAnswers = require("./routers/routerAnswers");

// Framework Express.
const app = express();

// El modulo de morgan devuelve un middleware que muestra por pantalla las peticiones recividas.
app.use(morgan("dev"));

// Motor de plantillas y ubicacion de vistas.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Obtener la ruta a los ficheros estaticos.
const fEstaticos = path.join(__dirname, "public");

// Compruebas si se solicitan recursos estaticos y si es asi devuelve
app.use(express.static(fEstaticos));
// Router que gestiona las rutas que no requieren que el usuario haya iniciado sesion.
app.use("/usuarios", routerPreSLogin);
// Inicializacion del servidor web
app.listen(config.port, function (err) {

    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }

});

const pool = mysql.createPool(config.mysqlConfig);

let oDAOUser = new DAOUser(pool);

let user = {
    email: "xx@gmail.com",
    pass: "ucm",
    img: null
};

let completeTask0 = {
    text: "Crear Servidor Node",
    done: 1,
    tags: ["JavaScript", "servidor", "tarea"]
};

// CALLBACKS

function cb_isUserCorrect(err, result) {

    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Usuario " + result.email + " y contraseña " + result.user_password +" correctos.");
    } else {
        console.log("Usuario y/o contraseña incorrectos.");
    }

}
function cb_createUser(err,create) {

    if (err) {
        console.log(err.message);
    }
    else if (create) {
        console.log("Usuario con ID " + create + " creado .");
    }



}

function cb_modifyUser(err,modificado_id) {

    if (err) {
        console.log(err.message);
    }
    else if (modificado_id) {
        console.log("Usuario con id " + modificado_id + " modificado");
    }



}

function cb_getUserImageName(err, img) {

    if (err) {
        console.log(err.message);
    } else {
        console.log(img);
    }

}

function cb_insertTask(err) {

        if (err) {
            console.log(err.message);
        } else {
            console.log("Añadido un tag a la nueva tarea.")
        }
}

function cb_getAllTask(err, tareas) {

    if (err) {

        console.log(err.message);

    } else {

        if(tareas.length == 0) {

            console.log("No hay tareas para el usuario introducido.")

        } else {

            console.log("Las tareas del usuario introducido son:");

            tareas.forEach(function(tarea) {

                console.log(tarea.id + " ; " + tarea.text + " ; " + tarea.done + " ; " + tarea.tags);

            });

        }

    }

}

function cb_markTaskDone(err) {

    if (err) {

        console.log(err.message);

    } else {

        console.log("Tarea marcada como hecha.")

    }

}

function cb_deleteCompleted(err) {

    if (err) {

        console.log(err.message);

    } else {

        console.log("Tareas completadas borradas.");

    }

}
