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
}

module.exports = ModelQuestions;