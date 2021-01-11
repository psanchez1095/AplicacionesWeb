"use strict";

// Modulos de Node.js
const path = require("path");
const express = require("express");
const multer = require("multer");

// Modulos propios.
const controllerUsers = require("../controllers/controllerUsers");

// Declaramos el Router "RouterUsuarios"
const routerUsers = express.Router();

// MulterFactory para poder trabajar con file/s (archivos de imagen)
const multerFactory = multer({ dest: path.join("public","img") });

// Definimos los manejadores de rutas del router Users

routerUsers.get("/ShowProfileImage/:email", controllerUsers.cargarImagenDePerfil);

routerUsers.get("/ShowProfileImageById/:id", controllerUsers.cargarImagenDePerfilById);

routerUsers.get("/GetUser/:id", controllerUsers.getUser);

routerUsers.get("/UserProfile", controllerUsers.mostrarPerfilDeUsuario);

routerUsers.get("/LogOut", controllerUsers.cerrarSesion);


module.exports = routerUsers;