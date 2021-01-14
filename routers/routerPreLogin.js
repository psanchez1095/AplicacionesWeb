"use strict";

//node modules
const path = require("path");
const express = require("express");
const multer = require("multer");

//Modulos propios de la app
const controllerPreLogin = require("../controllers/controllerPreLogin");

//RouterPreLogin
const routerPreLogin = express.Router();

//MulterFactory para poder trabajar con archivos(imagenes)
const multerFactory = multer({ dest: path.join("public","img") });

//Definimos las rutas del del routerPreLogin
routerPreLogin.post("/UserValidation", controllerPreLogin.isUserCorrect);

routerPreLogin.get("/Show_Index", controllerPreLogin.showIndex);

routerPreLogin.get("/Show_CreateAccount", controllerPreLogin.showCreateAccount);

routerPreLogin.post("/Create_User", multerFactory.single("user_img"), controllerPreLogin.createUser);

module.exports = routerPreLogin;