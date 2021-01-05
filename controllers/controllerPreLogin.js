"use strict";

// Modulos de node.
const path = require("path");
const mysql = require("mysql");

// Modulos propios.
const config = require("../config");
const modelPreLogin = require("../models/modelPreLogin");

// Pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// DAO
let daoModelPreLogin = new modelPreLogin (pool);

function showIndex(request, response, next) {
    response.setFlash(null);
    response.status(200);
    response.render("index");
}
function showCreateUser(request, response, next) {
    response.status(200);
    response.render("createAccount");
}

function createUser(request, response, next) {

    let fileName = (request.file)? request.file.originalname : "";
    const imagenRegexp = /.png$|.jpg$|.jpeg$|.bmp$/;

    if(fileName == "" || imagenRegexp.test(fileName)) {

        let usuario = {
            puntos: 0,
            sexo: request.body.sexo,
            email: request.body.email,
            clave: request.body.clave,
            nombre: request.body.nombre,
            fechaNacimiento: request.body.fechaNacimiento,
            imagen: (request.file)? request.file.filename : null
        };

        daoModelPreLogin.createUser(usuario, function (err) {

            if (err) {
                next(err);
            } else {
                response.status(200);
                response.redirect("index");
            }

        });

    } else {
        response.setFlash("* Imagen no válida.");
        response.status(200);
        response.redirect("createAccount");
    }

}

function isUserCorrect(request, response, next) {

    daoModelPreLogin.isUserCorrect(request.body.email,
        request.body.password, function (error, usuario) {
            if (error) {
                next(error);
            } else if (usuario != null) {
                // Graba la sesion en la base  de datos (como un registro).
                request.session.usuario = usuario;
                response.status(200);
                response.redirect("user_index");
            } else {
                response.setFlash("Email y/o contraseña no válidos");
                response.status(200);
                response.render("index");
            }
        });

}

module.exports = {
    showIndex: showIndex,
    createUser: createUser,
    isUserCorrect: isUserCorrect,
    showCreateUser : showCreateUser,

};
