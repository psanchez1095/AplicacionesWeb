//Grupo 21
//          Joel  Garcia Aparicio
//          Pedro Sánchez Escribano
"use strict";
//Previamente introdujimos un usuario en la base de datos tareas con:
//email ->pedrojoel@ucm.es
//password ->admin
//img ->AWImages
const mysql = require("mysql");

const DAOTask = require("./DAOTasks");
const DAOUser = require("./DAOUsers");

const mysql = require("mysql");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cuatrozerocuatro"
});


let oDAOTask = new DAOTask(pool);
let oDAOUser = new DAOUser(pool);

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

oDAOUser.isUserCorrect("pedro@ucm.es", "admin", cb_isUserCorrect);
/*//Work Done
oDAOTask.insertTask("pedrojoel@ucm.es", completeTask0, cb_insertTask);
oDAOTask.insertTask("pedrojoel@ucm.es", uncompleteTask1, cb_insertTask);
oDAOTask.insertTask("pedrojoel@ucm.es", completeTask2, cb_insertTask);
oDAOTask.insertTask("pedrojoel@ucm.es", uncompleteTask3, cb_insertTask);
*/


/*
// OK's
oDAOUser.isUserCorrect("pedro@ucm.es", "pedro", cb_isUserCorrect);
oDAOUser.isUserCorrect("pedro@ucm.es", "2", cb_isUserCorrect);
// KO's
oDAOUser.isUserCorrect("analacor@ucm.es", "1234", cb_isUserCorrect);
oDAOUser.isUserCorrect("gdelga@ucm.es", "1234", cb_isUserCorrect);

// OK's
oDAOUser.getUserImageName("mangue01@ucm.es", cb_getUserImageName);
oDAOUser.getUserImageName("fatimag@ucm.es", cb_getUserImageName);
oDAOUser.getUserImageName("natrod@ucm.es", cb_getUserImageName);
// KO's
oDAOUser.getUserImageName("analacor@ucm.es", cb_getUserImageName);
oDAOUser.getUserImageName("gdelga@ucm.es", cb_getUserImageName);

// OK's
oDAOTask.insertTask("fatimag@ucm.es", completeTask0, cb_insertTask);
oDAOTask.insertTask("fatimag@ucm.es", uncompleteTask1, cb_insertTask);
oDAOTask.insertTask("mangue01@ucm.es", completeTask1, cb_insertTask);
oDAOTask.insertTask("mangue01@ucm.es", uncompleteTask0, cb_insertTask);

// OK's
oDAOTask.getAllTasks("mangue01@ucm.es", cb_getAllTask);
oDAOTask.getAllTasks("fatimag@ucm.es", cb_getAllTask);
// KO's
oDAOTask.getAllTasks("analacor@ucm.es", cb_getAllTask);
oDAOTask.getAllTasks("gdelga@ucm.es", cb_getAllTask);
oDAOTask.getAllTasks("natrod@ucm.es", cb_getAllTask);

// OK's
oDAOTask.markTaskDone(54, cb_markTaskDone);
oDAOTask.markTaskDone(56, cb_markTaskDone);

// OK's
oDAOTask.deleteCompleted("fatimag@ucm.es", cb_deleteCompleted);
oDAOTask.deleteCompleted("mangue01@ucm.es", cb_deleteCompleted);

*/

// **** CALLBACKS ********************************************************************************

function cb_isUserCorrect(err, result) {

    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Usuario y contraseña correctos.");
    } else {
        console.log("Usuario y/o contraseña incorrectos.");
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
