'use strict'

// Cargar modulos de node para crear el servidor

var express = require('express');
var bodyParser = require('body-parser');


// Ejecutar express(http)

var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');

// Middlewares
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// CORS

// Añadir prefijos a rutas / Cargar rutas

app.use('/api', article_routes);

// Ruta pruebas


// Exportar modulo(fichero actual)
module.exports = app;