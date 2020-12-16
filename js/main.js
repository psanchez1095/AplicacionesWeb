//Grupo 21
//          Joel  Garcia Aparicio
//          Pedro Sánchez Escribano
"use strict";
const mysql = require("mysql");
const DAOUser = require("./DAOUsers");
const config = require("./config");
const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor
            + err.message);
    } else {
        console.log("Servidor arrancado en puerto 3000"
    }
});

const pool = mysql.createPool(config.mysqlConfig);

let oDAOUser = new DAOUser(pool);

let user = {
    email: "xx@gmail.com",
    pass: "ucm",
    img: null
};
let up_user = {
    email: "xx@gmail.com",
    id : 3,
    pass: "ucm",
    img: null
};

let completeTask0 = {
    text: "Crear Servidor Node",
    done: 1,
    tags: ["JavaScript", "servidor", "tarea"]
};

let uncompleteTask1 = {
    text: "Programar con jQuery",
    done: 0,
    tags: ["Query", "JS", "AW"]
};
let completeTask2 = {
    text: "Practica 3 Voluntaria (Node+MySql)",
    done: 1,
    tags: ["Node", "MySQL", "Xamp", "tarea"]
};

let uncompleteTask3 = {
    text: "Practica Obligatoria 404 WebApp",
    done: 0,
    tags: ["NODE", "HTML5", "CSS3","JS","JQuery" ]
};
//Pruebas
//oDAOUser.isUserCorrect("xx@gmail.com", "123", cb_isUserCorrect);  // probada
//oDAOUser.getUserImageName("p@gmail.com",cb_getUserImageName);     //probada
//oDAOUser.createUser(user, cb_createUser);                         // probada
//oDAOUser.modifyUser(up_user, cb_modifyUser);                      // probada

// **** CALLBACKS ********************************************************************************

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
