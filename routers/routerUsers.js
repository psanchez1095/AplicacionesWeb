"use strict";

//node modules
const path = require("path");
const express = require("express");
const multer = require("multer");

//Modulos propios de la app
const controllerUsers = require("../controllers/controllerUsers");

//RouterUsers
const routerUsers = express.Router();

//MulterFactory para poder trabajar con archivos(imagenes)
const multerFactory = multer({ dest: path.join("public","img") });

//Definimos las rutas del routerUsers

routerUsers.get("/ShowProfileImage/:email", controllerUsers.cargarImagenDePerfil);

routerUsers.get("/ShowProfileImageById/:id", controllerUsers.cargarImagenDePerfilById);

routerUsers.get("/GetUser/:id", controllerUsers.getUser);

routerUsers.get("/UserProfile", controllerUsers.mostrarPerfilDeUsuario);

routerUsers.get("/LogOut", controllerUsers.cerrarSesion);


module.exports = routerUsers;