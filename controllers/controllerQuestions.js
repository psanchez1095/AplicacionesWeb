"use strict";

// Modulos de node.
const path = require("path");
const mysql = require("mysql");

// Modulos propios.
const config = require("../config");
const modelQuestion = require("../models/modelQuestions");

// Pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// DAO
let daoModelQuestion = new modelQuestion(pool);

function showRandomQuestions(request, response, next) {

    daoModelQuestion.getQuestions(function (err, questionList) {

        if (err) {
            next(err);
        } else {
            response.status(200);
            response.render("questions_index", { questions: questionList });
        }

    });

}
function showQuestionsByText(request, response, next) {

    daoModelQuestion.getQuestionsByText(request.body.textSearch ,request.body.modoBusqueda,function (err, questionList) {

        if (err) {
            next(err);
        } else {
            response.status(200);
            response.render("questions_index", { questions: questionList });
        }

    });

}
function addQuestion(request, response, next) {

    daoModelQuestion.addQuestion(request.body.title,request.body.text,request.body.tags, request.session.user.id ,function (err, question) {

        if (err) {
            next(err);
        } else {
            response.status(200);
            response.redirect("/preguntas/QuestionIndex");
        }

    });

}
function showQuestion_basic(request, response, next) {

    daoModelQuestion.getQuestion(request.params.id,function (err, question) {

        if (err) {
            next(err);
        } else {
            response.status(200);
            response.render("questions_index", { questions: question });
        }

    });

}




function showQuestion_extended(request, response, next) {

    daoModelQuestion.getQuestion(request.params.id, function (err, preguntaObtenida) {

        if (err) {
            next(err);
        }
        else {

            daoModelQuestion.preguntaRespondida(request.session.usuario.Id, request.params.id, function (err, estacontestada) {

                if (err) {
                    next(err);
                } else {

                    oModeloCuestiones.obtenerAmigosQueHanRespondidoPregunta(request.session.usuario.Id, request.params.id, function (err, listaAmigos) {

                        if (err) {
                            next(err);
                        } else {

                            response.status(200);
                            response.render("VistaDePregunta", { amigos: listaAmigos, pregunta: preguntaObtenida, contestada: estacontestada });

                        }

                    });

                }

            });
        }

    });

}

function mostrarContestarPreguntaPorUnoMismo(request, response, next) {

    oModeloCuestiones.obtenerPregunta(request.params.id, function (err, pregunta) {

        if (err) {
            next(err);
        } else {

            oModeloCuestiones.obtenerRespuestasDeUnaPregunta(request.params.id, function (err, listaRespuestas) {

                if (err) {
                    next(err);
                } else {
                    response.status(200);
                    response.render("ResponderUnaPreguntaParaSiMismo", { pregunta: pregunta, respuestas: listaRespuestas });
                }

            });

        }

    });

}

function addAnswer(request, response, next) {

    // Si la respuesta ya existe.
    if (request.body.respuesta != -1) {

        daoModelQuestion.addAnswerMyself(request.session.usuario.Id, request.body.Id_pregunta, request.body.respuesta, function (err) {

            if (err) {
                next(err);
            } else {
                response.status(200);
                response.setFlash("¡Tu respuesta ha sido añadida!");
                response.redirect("/preguntas/RandomQuestions");
            }

        });

    } else { // Si hemos creado una nueva respuesta.

        if(request.body.texto.trim() != "") {

            daoModelQuestion.addAnswers([[request.body.title, request.body.text]], function (err, Id_respuesta) {

                if (err) {
                    next(err);
                } else {

                    daoModelQuestion.addAnswerMyself(request.session.usuario.id, request.body.title, Id_respuesta, function (err) {

                        if (err) {
                            next(err);
                        } else {
                            response.status(200);
                            response.redirect("/preguntas/RandomQuestions");
                        }

                    });

                }

            });

        } else {
            response.status(200);
            response.setFlash("* Este campo no puede quedar vacío cuando es seleccionado.");
            response.redirect(`/preguntas/AnswerMySelf/${request.body.Id_pregunta}`);
        }

    }

}

function showCreateQuestion(request, response, next) {
    response.status(200);
    response.render("createQuestion");
}

function insertarPreguntaRespuesta(request, response, next) {

    oModeloCuestiones.insertarPregunta(request.body.pregunta, function (err, Id_pregunta) {

        if (err) {
            next(err);
        }
        else {

            let respuestas = [];
            respuestas.push([Id_pregunta, request.body.respuesta0]);
            respuestas.push([Id_pregunta, request.body.respuesta1]);
            respuestas.push([Id_pregunta, request.body.respuesta2]);
            respuestas.push([Id_pregunta, request.body.respuesta3]);

            oModeloCuestiones.insertarRespuestas(respuestas, function (err, Id_respuesta) {

                if (err) {
                    next(err);
                } else {
                    response.status(200);
                    response.setFlash("¡Se ha añadido tu pregunta!");
                    response.redirect("/cuestiones/ListadoAleatorioDePreguntas");
                }

            });

        }

    });


}

module.exports = {
    addAnswer: addAnswer,
    mostrarContestarPreguntaPorUnoMismo: mostrarContestarPreguntaPorUnoMismo,
    showCreateQuestion: showCreateQuestion,
    showRandomQuestions: showRandomQuestions,
    showQuestion_basic: showQuestion_basic,
    addQuestion: addQuestion,
    showQuestionsByText:showQuestionsByText
};


