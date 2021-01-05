"use strict";

// Modulos de Node.js
const path = require("path");
const express = require("express");
const multer = require("multer");

// Modulos propios.
const controllerPreLogin = require("../controllers/controllerPreLogin");

// Declaramos el Router "RouterUsuarios"
const routerPreLogin = express.Router();

// MulterFactory para poder trabajar con file/s (archivos de imagen)
const multerFactory = multer({ dest: path.join("public","img") });

// Definimos los manejadores de rutas del router Users
routerPreLogin.post("/UserValidation", controllerPreLogin.isUserCorrect);
routerPreLogin.get("/Index", controllerPreLogin.showIndex);

routerPreLogin.get("/User_Index", controllerPreLogin.showCreateUser);
routerPreLogin.post("/CreateUser", multerFactory.single("imagen"), controllerPreLogin.createUser);

module.exports = routerPreLogin;