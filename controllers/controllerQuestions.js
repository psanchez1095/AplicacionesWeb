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
            var modo="index";
            response.render("questions_index", { questions: questionList,model: modo });
        }

    });

}

function showQuestionsWithoutAnswers(request, response, next) {

    daoModelQuestion.getQuestionsWithoutAnswers(function (err, questionList) {

        if (err) {
            next(err);
        } else {
            questionList = questionList.filter(element => {
                if(element.answers[0]  === null){
                    return element;
                }

            });

            response.status(200);
            var modo="sinresponder";
            response.render("questions_index", { questions: questionList , model: modo });
        }

    });

}
function showQuestionsByTextTag(request, response, next) {

    daoModelQuestion.getQuestionsByTextTag(request.body.textSearch ,request.body.modoBusqueda,function (err, questionList) {

        if (err) {
            next(err);
        } else {

            if(request.body.modoBusqueda !== undefined) {
                questionList = questionList.filter(element => {
                        return element.tags.includes(request.body.textSearch);

                    });

            }
            response.status(200);
            var modo="buscar";
            response.render("questions_index", { questions: questionList , model: modo });
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

function addAnswer(request, response, next) {

    daoModelQuestion.addAnswer( request.body.answer,request.body.question_id,request.session.user.id ,function (err, question) {

        if (err) {
            next(err);
        } else {
            response.status(200);
            response.redirect("/preguntas/QuestionIndex");
        }

    });
}

function showQuestion_basic(request, response, next) {

    daoModelQuestion.getQuestion(request.body.idnecesario,function (err, question) {

        if (err) {
            next(err);
        } else {

            question = question.filter(element => {
                    if(element.idp  == request.body.idnecesario){
                        return element;
                    }
            });

            response.status(200);
            response.render("question_detail", { questions: question });

        }

    });

}

function showCreateQuestion(request, response, next) {
    response.status(200);
    response.render("createQuestion");
}

module.exports = {
    showCreateQuestion: showCreateQuestion,
    showRandomQuestions: showRandomQuestions,
    showQuestionsByTextTag:showQuestionsByTextTag,
    showQuestionsWithoutAnswers :showQuestionsWithoutAnswers,
    showQuestion_basic: showQuestion_basic,
    addQuestion: addQuestion,
    addAnswer: addAnswer,






};


