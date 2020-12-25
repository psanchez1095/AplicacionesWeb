"use strict";

class ModelUsers {

    constructor(pool) {
        this.pool = pool;
    }

    createUser(user,callback){

        this.pool.getConnection(function(err,conexion){

            if(err) callback(err);

            else{

                conexion.query("INSERT INTO users(email, user_password, user_img) VALUES (?, ?, ?)",
                    [user.email,user.pass,user.img],

                    (err,results) => {

                    conexion.release();

                    if(err) callback(new Error("No se puede crear el usuario."),null);
                    else callback(null, results.insertId);

                }

                );
            }
        });
    }

    modifyUser(user,callback){
        this.pool.getConnection(function(err,conexion){
            if(err){
                callback(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                const sql = "UPDATE users SET email = ?, user_password = ?, user_img = ? WHERE  id = ?";
                conexion.query(sql,[user.email,user.pass,user.img,user.id],function(err,fila){
                    conexion.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else{
                        callback(null,user.id);
                    }
                })
            }
        })
    }

    isUserCorrect(email, password, callback) {

        this.pool.getConnection(function (err, connection) {

            if (err) callback(new Error("Error de conexión a la base de datos."), null);

             else {

                connection.query("SELECT * FROM users WHERE email = ? AND user_password= ?",
                    [email, password],

                     (err, filas) => {

                        connection.release();

                        if (err) callback(new Error("Error de acceso a la base de datos."), null);
                        else callback(null, (filas.length == 1) ? filas[0] : false);


                    }

                );

            }

        });

    }

    getUserImageName(email, callback) {

        this.pool.getConnection(function (err, connection) {

            if (err) {

                callback(new Error("Error de conexión a la base de datos."), null);

            } else {

                connection.query("SELECT user_img FROM users WHERE email = ?", [email],

                     (err, filas) => {

                        connection.release();

                        if (err) callback(new Error("Usuario Incorrecto o Imagen No Disponible."), null);

                        else {

                            if (filas.length == 0)  callback(new Error("No existe el usuario."), null);
                            else callback(null, filas[0].user_img);

                        }

                    }

                );

            }

        });

    }

}

module.exports = ModelUsers;