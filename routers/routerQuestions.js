"use strict";

// Modulos de Node.js
const path = require("path");
const express = require("express");
const multer = require("multer");

// Modulos propios.
const controllerQuestions = require("../controllers/controllerQuestions");

// Declaramos el Router "RouterUsuarios"
const routerQuestions = express.Router();

// MulterFactory para poder trabajar con file/s (archivos de imagen)
const multerFactory = multer({ dest: path.join("public","img") });

// Definimos los manejadores de rutas del router Users
routerQuestions.get("/QuestionIndex", controllerQuestions.showRandomQuestions);

routerQuestions.get("/ShowCreateQuestion", controllerQuestions.showCreateQuestion); // lleva a la vista

routerQuestions.get("/ShowQuestion/:id", controllerQuestions.showQuestion_basic);

routerQuestions.get("/AnswerMySelf/:id", controllerQuestions.mostrarContestarPreguntaPorUnoMismo);

routerQuestions.post("/AddAnswer", controllerQuestions.addAnswer);

routerQuestions.post("/AddQuestion", controllerQuestions.addQuestion);


module.exports = routerQuestions;