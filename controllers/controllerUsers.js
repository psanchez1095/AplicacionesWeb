"use strict";

// Modulos de node.
const path = require("path");
const mysql = require("mysql");

// Modulos propios.
const config = require("../config");
const modelUser = require("../models/modelUsers");

// Pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// DAO
let daoModelUser = new modelUser(pool);

function mostrarPerfilDeUsuario(request, response) {
    response.status(200);
    response.render("index_postLogin");
}

function cargarImagenDePerfil(request, response, next) {

    daoModelUser.getUserImageName(request.params.id, function (err, nombreImagen) {

        if (err) {
            next(err);
        } else {
            response.sendFile(path.join(__dirname, "..", "public", "img", (nombreImagen) ? nombreImagen : "user.png"));
        }

    });

}


function cerrarSesion(request, response) {
    response.setFlash(null);
    response.status(200);
    response.render("index");
    request.session.destroy();
}

module.exports = {
    cerrarSesion: cerrarSesion,
    cargarImagenDePerfil: cargarImagenDePerfil,
    mostrarPerfilDeUsuario: mostrarPerfilDeUsuario,

};
