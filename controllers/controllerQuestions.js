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
let daoModelQuestion = new modelQuestions(pool);

