"use strict";

// Modulos de Node.js
const path = require("path");
const express = require("express");
const multer = require("multer");

// Modulos propios.
const controllerUsers = require("../controllers/controllerQuestions");

// Declaramos el Router "RouterUsuarios"
const routerQuestions = express.Router();

// MulterFactory para poder trabajar con file/s (archivos de imagen)
const multerFactory = multer({ dest: path.join("public","img") });

// Definimos los manejadores de rutas del router Users




module.exports = routerQuestions;