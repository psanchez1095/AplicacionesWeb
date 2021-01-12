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
                                tags:tags.split(",")
                            };
                            console.log(auxTag.tags);
                            auxTag.tags.forEach(function (tag){connection.query(
                                "INSERT INTO tags (question_id,text) VALUES (?,?)",
                                [idQuestion,tag],
                                function (err, result) {

                                    if (err) {
                                        callBack(new Error("Error al insertar la etiqueta en la bases de datos."));
                                    } else {

                                    }

                                })});
                            callBack(null, result.insertId);
                        }

                    });

            }

        });


    }

    getQuestions2(callback){

        this.pool.getConnection(function (err, connection) {
            let todasPreguntas=[]
            var x=[]
            if (err) {
                callback(new Error("Error de conexión a la base de datos."), null);
            } else {
                connection.query(
                    "SELECT DISTINCT u.id as user,u.cuatrozerocuatro_name,u.user_img,p.id,p.user_id,p.title,p.text,DATE_FORMAT(p.fecha, '%d/%m/%y') AS fecha from users u INNER join questions p on u.id = p.user_id",
                    function (err, result) {

                        if (err) {
                            callback(new Error("Error al insertar la pregunta en la bases de datos."));
                        } else {

                            result.forEach(element => {
                                if(todasPreguntas.every(function(t){
                                    return(t.id!==element.id)
                                })){
                                    todasPreguntas.push({idUser:element.user,idp:element.id,idQuestion:element.user_id,title:element.title,text:element.text,cuatrozerocuatro_name:element.cuatrozerocuatro_name,imagen:element.user_img,fecha:element.fecha,tags2:[]})
                                }
                            })

                            todasPreguntas.forEach(function (tag){connection.query(
                                "SELECT * from tags",
                                function (err, result) {

                                    if (err) {
                                        callback(new Error("Error al insertar la etiqueta en la bases de datos."));
                                    } else {

                                        result.forEach(function(el){
                                            todasPreguntas.forEach(function(fila){
                                                if(el.question_id === fila.idp){

                                                    fila.tags2.push(el.text);
                                                }
                                            })
                                        })
                                    }


                                })});
                            connection.release();
                            callback(null, todasPreguntas);
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
                                todasPreguntas.push({idUser:element.user,idp:element.id,idQuestion:element.user_id,title:element.title,text:element.text,cuatrozerocuatro_name:element.cuatrozerocuatro_name,imagen:element.user_img,fecha:element.fecha,tags2:[]})
                            }
                        })
                        rows.forEach(el=>{
                            todasPreguntas.forEach(fila=> {
                                if(el.question_id === fila.idp){
                                    fila.tags2.push({text:el.textTag,tag_id:el.tagId});
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


    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {

            if (err)  callback(new Error("Error de conexión a la base de datos."), null);

            else {

                connection.query(
                    "SELECT task.id, task.text, task.done, GROUP_CONCAT(tag.tag) 'tags' FROM task, tag WHERE task.id = tag.taskId AND task.user = ? GROUP BY task.id",
                    [email],

                    function (err, filas) {

                        connection.release(); // Liberamos la conexion

                        if (err) callback(new Error("Error de acceso a la base de datos."), null);

                        else {

                            let tareas = [];

                            filas.forEach(function (fila) {

                                let tarea = {
                                    id: fila.id,
                                    text: fila.text,
                                    done: fila.done,
                                    tags: fila.tags.split(",")
                                };

                                tareas.push(tarea);

                            });

                            callback(err, tareas);

                        }

                    }

                );

            }

        });

    }

    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {

            if (err) callback(new Error("Error de conexión a la base de datos."), null);

            else {

                connection.query(
                    "INSERT INTO task(user,text,done) VALUES(?,?,?)",
                    [email, task.text, task.done],

                    function (err, filas) {

                        if (err) callback(new Error("Error de acceso11 a la base de datos."));

                        else {

                            task.tags.forEach(function (tag) {

                                connection.query(
                                    "INSERT INTO tag (taskId,tag) VALUES(?,?)",
                                    [filas.insertId, tag],

                                    function (err, filas) {

                                        if (err) callback(new Error("Error de acceso a la base de datos."));

                                        else callback(null);

                                    }

                                );

                            });
                            connection.release(); // Liberamos la conexion.

                        }

                    }

                );

            }

        });

    }

    markTaskDone(idTask, callback) {

        this.pool.getConnection(function (err, connection) {

            if (err) callback(new Error("Error de conexión a la base de datos."));

            else {

                connection.query("UPDATE task SET done=1 WHERE id= ?",
                    [idTask],
                    function (err, filas) {

                        connection.release();

                        if (err) callback(new Error("Error de acceso a la base de datos."));
                        else callback(null);

                    }
                );
            }
        });
    }

    deleteCompleted(email, callback) {

        this.pool.getConnection(function (err, connection) {

            if (err) {

                callback(new Error("Error de conexión a la base de datos."));

            } else {

                connection.query("DELETE FROM task WHERE task.user = ? AND task.done = 1",
                    [email],
                    function (err, filas) {

                        connection.release();

                        if (err) callback(new Error("Error de acceso a la base de datos."));

                        else callback(null);



                    })

            }

        });

    }
    getQuestion(Id_Pregunta, callBack){

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                connection.query(
                    "SELECT * FROM questions WHERE Id = ?",
                    [Id_Pregunta],
                    function (err, result) {

                        connection.release(); // Liberamos la conexion

                        if (err) {
                            callBack(new Error("Error al insertar la pregunta en la bases de datos."), null);
                        } else {
                            callBack(null,result[0]);
                        }

                    });

            }

        });
    }


    getAnswersForQuestion(Id_pregunta, callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            } else {

                connection.query(
                    "SELECT * FROM answers WHERE Question_id = ?",
                    [Id_pregunta],
                    function (err, result) {

                        connection.release(); // Liberamos la conexion

                        if (err) {
                            callBack(new Error("Error al extraer respuestas de una pregunta."), null);
                        } else {
                            callBack(null,result);
                        }

                    });

            }

        });

    }


    addAnswer(answer, callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            } else {

                connection.query(
                    "INSERT INTO answers (Question_id,text) VALUES ?",
                    [answer],
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