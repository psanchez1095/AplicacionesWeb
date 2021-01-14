"use strict";

//node modules
const path = require("path");
const express = require("express");
const multer = require("multer");

//Modulos propios de la app
const controllerQuestions = require("../controllers/controllerQuestions");

//RouterQuestions
const routerQuestions = express.Router();

//MulterFactory para poder trabajar con archivos(imagenes)
const multerFactory = multer({ dest: path.join("public","img") });

//Definimos las rutas del  del routerQuestions
routerQuestions.get("/QuestionIndex", controllerQuestions.showRandomQuestions);

routerQuestions.get("/QuestionWithoutAnswer", controllerQuestions.showQuestionsWithoutAnswers);

routerQuestions.post("/QuestionByTextOrTag", controllerQuestions.showQuestionsByTextTag);

routerQuestions.get("/ShowCreateQuestion", controllerQuestions.showCreateQuestion); // lleva a la vista

routerQuestions.post("/ShowQuestion", controllerQuestions.showQuestion_basic);

routerQuestions.post("/AddAnswer", controllerQuestions.addAnswer);

routerQuestions.post("/AddQuestion", controllerQuestions.addQuestion);


module.exports = routerQuestions;