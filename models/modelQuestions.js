"use strict";

class ModelQuestions {

    constructor(pool) {
        this.pool = pool;
    }
    addQuestion(question_title,question_text,tags,user_id, callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            } else {
                var date;
                date = new Date();
                date = date.getUTCFullYear() + '-' +
                    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                    ('00' + date.getUTCDate()).slice(-2) + ' ' +
                    ('00' + date.getUTCHours()).slice(-2) + ':' +
                    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
                console.log(date);
                connection.query(
                    "INSERT INTO questions (title,user_id,text,fecha) VALUES (?,?,?,?)",
                    [question_title,user_id,question_text,date],
                    function (err, result) {

                        if (err) {
                            callBack(new Error("Error al insertar la pregunta en la bases de datos."));
                        } else {
                            var idQuestion = result.insertId;
                            let auxTags = [];
                            let auxTag = {
                                tags:tags.split("@",5)

                            };
                            console.log(auxTag.tags);
                            auxTag.tags.forEach(function (tag){

                                if(tag!="") {
                                    connection.query(
                                        "INSERT INTO tags (question_id,text) VALUES (?,?)",
                                        [idQuestion, tag],
                                        function (err, result) {

                                            if (err) {
                                                callBack(new Error("Error al insertar la etiqueta en la bases de datos."));
                                            } else {

                                            }

                                        })
                                }
                                });
                            callBack(null, result.insertId);
                        }

                    });

            }

        });


    }


    getQuestions(callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(err);
            }
            else{
                var sql = "SELECT u.id as user,u.cuatrozerocuatro_name,u.user_img,p.id,p.user_id,p.title,p.text,DATE_FORMAT(p.fecha, '%d/%m/%y') AS fecha , e.id as tagId ,e.text as textTag,e.question_id from users u INNER join questions p on u.id = p.user_id LEFT JOIN tags e on e.question_id = p.id "
                connection.query(sql,function(error,rows){

                    if(error){
                        callback(error);
                    }
                    else{


                        let todasPreguntas=[]
                        rows.forEach(element => {
                            if(todasPreguntas.every(function(t){
                                return(t.idp!==element.id)
                            })){
                                todasPreguntas.push({idUser:element.user,idp:element.id,idQuestion:element.user_id,title:element.title,text:element.text,cuatrozerocuatro_name:element.cuatrozerocuatro_name,imagen:element.user_img,fecha:element.fecha,tags:[]})
                            }
                        })
                        rows.forEach(el=>{
                            todasPreguntas.forEach(fila=> {
                                if(el.question_id === fila.idp){
                                    fila.tags.push(el.textTag);
                                }
                            })
                        })
                        callback(null,todasPreguntas);

                    }

                })
                connection.release();
            }
        })

    }

    getQuestionsWithoutAnswers(callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(err);
            }
            else{
                var sql = "SELECT u.id as user,u.cuatrozerocuatro_name,u.user_img,p.id,p.user_id,p.title,p.text,DATE_FORMAT(p.fecha, '%d/%m/%y') AS fecha , e.id as tagId ,e.text as textTag,e.question_id,a.text as anstext from users u INNER join questions p on u.id = p.user_id LEFT JOIN tags e on e.question_id = p.id LEFT JOIN answers a on a.question_id = p.id  "
                connection.query(sql,function(error,rows){

                    if(error){
                        callback(error);
                    }
                    else{


                        let todasPreguntas=[]
                        rows.forEach(element => {
                            if(todasPreguntas.every(function(t){
                                return(t.idp!==element.id)
                            })){
                                todasPreguntas.push({idUser:element.user,idp:element.id,idQuestion:element.user_id,title:element.title,text:element.text,cuatrozerocuatro_name:element.cuatrozerocuatro_name,imagen:element.user_img,fecha:element.fecha,tags:[],answers:[]})
                            }
                        })
                        rows.forEach(el=>{
                            todasPreguntas.forEach(fila=> {
                                if(el.question_id === fila.idp){
                                    fila.tags.push(el.textTag);
                                    fila.answers.push(el.anstext);
                                }
                            })
                        })
                        callback(null,todasPreguntas);

                    }

                })
                connection.release();
            }
        })

    }

    getQuestionsByTextTag(text,modoBusqueda,callback){

        this.pool.getConnection(function(err,connection){
            if(err){
                callback(err);
            }
            else{
                var sql=undefined;

                if(modoBusqueda!=undefined){
                    sql = " SELECT u.id as user,u.cuatrozerocuatro_name,u.user_img,p.id,p.user_id,p.title,p.text,DATE_FORMAT(p.fecha, '%d/%m/%y') AS fecha , e.id as tagId ,e.text as textTag,e.question_id from users u INNER join questions p on u.id = p.user_id LEFT JOIN tags e on e.question_id = p.id " ;
                }else{
                    sql = " SELECT u.id as user,u.cuatrozerocuatro_name,u.user_img,p.id,p.user_id,p.title,p.text,DATE_FORMAT(p.fecha, '%d/%m/%y') AS fecha , e.id as tagId ,e.text as textTag,e.question_id from users u INNER join questions p on u.id = p.user_id LEFT JOIN tags e on e.question_id = p.id where p.text LIKE CONCAT ('%', ?, '%')  or  p.title LIKE CONCAT ('%', ?, '%')" ;
                }

                connection.query(sql,[text,text],function(error,rows){


                    if(error){
                        callback(error);
                    }
                    else{
                        let listQuestions=[]
                        rows.forEach(element => {
                            if(listQuestions.every(function(t){
                                return(t.idp!==element.id)
                            })){
                                listQuestions.push(
                                    {idUser:element.user,idp:element.id,idQuestion:element.user_id,title:element.title,text:element.text,cuatrozerocuatro_name:element.cuatrozerocuatro_name,imagen:element.user_img,fecha:element.fecha,tags:[]})
                            }
                        })

                        rows.forEach(el=>{
                            listQuestions.forEach(fila=> {
                                if(el.question_id === fila.idp){
                                    fila.tags.push(el.textTag);
                                }
                            })
                        })
                        console.log(listQuestions);



                        callback(null,listQuestions);

                    }

                })
                connection.release();
            }
        })

    }

    getQuestion(Id_Pregunta, callBack){

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                connection.query(
                    /*SELECT p.id,p.user_id,p.title,p.text,a.id as answer_id ,a.user_id AS answer_user_id,a.text,DATE_FORMAT(p.fecha, '%d/%m/%y')AS fecha from questions p INNER join answers a on p.id = a.Question_id*/
                    "SELECT a.text as answerText, p.id,p.user_id,p.title,p.text as perro ,a.Question_id,a.id as answer_id ,a.user_id AS answer_user_id,a.text,DATE_FORMAT(p.fecha, '%d/%m/%y')AS fecha  from questions p  left join  answers a on p.id = a.Question_id  and Question_id = ? ",
                    [Id_Pregunta],
                    function (err, result) {

                        connection.release(); // Liberamos la conexion

                        if (err) {
                            callBack(new Error("Error al insertar la pregunta en la bases de datos."), null);
                        } else {
                            let todasPreguntas=[]
                            result.forEach(element => {
                                if(todasPreguntas.every(function(t){
                                    return (t.idp !== result.id)
                                })){
                                        todasPreguntas.push({idp:element.id,id_question_answer:element.Question_id,title:element.title,text:element.perro,fecha:element.fecha,answers:[]})
                                    }
                                })



                            result.forEach(el=>{
                                todasPreguntas.forEach(fila=> {

                                    if(el.Question_id=== fila.idp){
                                        fila.answers.push({text:el.answerText,a_id:el.answer_id});
                                    }
                                })
                            })
                            callBack(null,todasPreguntas);

                        }

                    });

            }

        });
    }

    addAnswer(answer,idPregunta,idUser, callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            } else {

                connection.query(
                    "INSERT INTO answers (  Question_id,user_id,text) VALUES (?,?,?)",
                    [idPregunta,idUser,answer],
                    function (err, result) {

                        connection.release(); // Liberamos la conexion

                        if (err) {
                            callBack(new Error("Error al insertar la pregunta en la bases de datos."), null);
                        } else {
                            callBack(null, result.insertId);
                        }

                    });
            }
        });

    }



}

module.exports = ModelQuestions;