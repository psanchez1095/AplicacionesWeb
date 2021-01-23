"use strict";

class ModelPreLogin {

    constructor(pool) {
        this.pool = pool;
    }

    createUser(user, callback) {

        this.pool.getConnection(function (err, conexion) {

            if (err) callback(err);
            if (user.user_password != user.user_passwordX) {callback( null,"Las contraseñas no coinciden, revisalo");}

            else {



                conexion.query("INSERT INTO users(email, user_password, user_img, cuatrozerocuatro_name) VALUES (?, ?, ?,?)",
                    [user.email, user.user_password, user.user_img,user.cuatrozerocuatro_name],

                    (err, results) => {

                        conexion.release();

                        if (err) callback(new Error("No se puede crear el usuario."), null);
                        else callback(null, results.insertId);

                    }
                );
            }
        });
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
                        {

                            let usuario = null;

                            if (filas.length == 1) {

                                usuario = {};
                                usuario.id = filas[0].id;
                                usuario.email = filas[0].email;
                                usuario.user_password = filas[0].user_password;
                                usuario.user_img = filas[0].user_img;
                                usuario.cuatrozerocuatro_name = filas[0].cuatrozerocuatro_name;

                            }

                            callback(null, usuario);

                        }


                    }

                );

            }

        });

    }

}

module.exports =  ModelPreLogin;