"use strict";

class daoQuestions{
    constructor(pool){
        this.pool = pool
    }

    insertQuestion(question, callBack){
        this.pool.getConnection(function (err, connection){
            if(err){
                callBack(new Error("Error de conexion con la base de datos."));
            }else {
                connection.query(
                    "INSERT INTO Questions (texto) VALUES (?)",
                    [question],
                    function(err, result){
                        connection.release(); //para liberar memoria
                        if(err){
                            callBack(new Error("Error al insertar pregunta a la base de datos."));
                        }else{
                            callBack(null, result.insertID)
                        }
                    }
                );
            }
        });
    }

} //class