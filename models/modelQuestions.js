"use strict";

class ModelQuestions {

    constructor(pool) {
        this.pool = pool;
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

    addQuestion(question, callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."), null);
            } else {
                connection.query(
                    "INSERT INTO questions (text) VALUES (?)",
                    [question],
                    function (err, result) {

                        connection.release(); // Liberamos la conexion
                        if (err) {
                            callBack(new Error("Error al insertar la pregunta en la bases de datos."));
                        } else {
                            callBack(null, result.insertId);
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

    getRandomQuestions(callBack) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callBack(new Error("Error de conexión a la base de datos."));
            } else {

                connection.query(
                    "SELECT * FROM questions ORDER BY RAND() LIMIT 5",
                    function (err, result) {

                        connection.release(); // Liberamos la coenxion

                        if (err) {
                            callBack(new Error("Error al extraer las preguntas de la base de datos."));
                        } else {
                            callBack(null, result);
                        }

                    });

            }

        });

    }

}

module.exports = ModelQuestions;