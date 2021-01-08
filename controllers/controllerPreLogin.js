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
    response.redirect("/index");
}
function showCreateAccount(request, response, next) {
    response.status(200);
    response.render("CreateAccount");
}

function createUser(request, response, next) {

    const imgRegExp = /.png$|.jpg$|..bmp$/;
    let fileName = (request.file)? request.file.originalname : "";

    if(fileName == "" || imgRegExp.test(fileName)) {

        let user = {
            email: request.body.email,
            user_password: request.body.user_password,
            cuatrozerocuatro_name: request.body.cuatrozerocuatro_name,
            user_img: (request.file)? request.file.filename : null
        };

        daoModelPreLogin.createUser(user, function (err) {

            if (err) {
                next(err);
            } else {
                response.status(200);
                response.setFlash("Usuario Creado con Exito.");
                response.redirect("/ShowIndex");

            }

        });

    } else {
        response.setFlash("* Imagen no válida.");
        response.status(200);
        response.render("createAccount");
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
                response.redirect("UserProfile");
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
    showCreateAccount : showCreateAccount,

};
