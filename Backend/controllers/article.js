'use strict'

var validator = require('validator');
var Article = require('../models/article');
const { param } = require('../routes/article');

var fs = require('fs');
var path = require('path');
const { exists } = require('../models/article');

var controller = {

    save: (req, res) => {

        //Recoger parametros por POST
        var params = req.body;

        //Validar datos(validator)
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(300).send({
                status: 'Error',
                message: 'Faltan datos por enviar!!!'
            })
        }

        if (validate_title && validate_content) {
            //Crear objeto a guardar
            var article = new Article();
            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //Guardar el artículo

            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'Error',
                        message: 'El articulo no se ha guardado!!'
                    });
                }

                //Devolver una respuesta
                return res.status(200).send({
                    status: 'Success',
                    article
                });

            });


        } else {
            return res.status(300).send({
                status: 'Error',
                message: 'Los datos no son validos! '
            })
        }


    },
    findAll: (req, res) => {

        var last = req.params.last;
        var query = Article.find({});

        if (last || last != undefined) {
            query.limit(5)
        }

        //Find

        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(300).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                })
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            })
        })

    },
    findOne: (req, res) => {

        //Recoger el id de la URL
        var articleId = req.params.id;

        //Comprobar si existe

        if (!articleId || articleId == null) {

            return res.status(404).send({
                status: 'error',
                message: 'No hay articulos para mostrar'
            })

        }

        //Buscar el articulo 

        Article.findById(articleId, (err, article) => {

            if (err || !articleId) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo!!!'
                })
            }

            //Devolver en json
            return res.status(200).send({
                status: 'success',
                article
            })

        });



    },
    update: (req, res) => {
        // Recoger el Id del articulo
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })

        }

        if (validate_title && validate_content) {

            // Find and update
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar!!'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });
            });
            //Devolver respuesa
        } else {
            return res.status(300).send({
                status: 'error',
                message: 'La validacion no es correcta!!'
            })
        }

    },
    delete: (req, res) => {

        //Recoger el Id de la url

        var articleId = req.params.id;

        //Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar!!'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });

    },
    upload: (req, res) => {

        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición

        var file_name = 'Imagen no subida...';

        if (!req.files) {

            return res.status(404).send({
                status: 'success',
                message: file_name
            });
        }
        // Conseguir nombre y la extensión del archivo 

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        // Comprobar la extension, solo imagenes, si no es valida borrar el fichero

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            //Borrar el archivo subido
            fs.unlink(file_path, (err) => {

                return res.status(300).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            })

        } else {

            // Si todo es valido 
            var articleId = req.params.id;

            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

                if (err || !articleUpdated) {
                    return res.status(300).send({
                        status: 'success',
                        message: 'Error al guardar la imagen de artículo' + err
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });

            });



        }


    },
    getImage: (req, res) => {

        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        if (fs.existsSync(path_file)) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe!!'
            });
        }



    },
    search: (req, res) => {

        //Sacar el string a buscar

        var searchString = req.params.search;

        //Find or

        Article.find({
                //Si searchString está incluido dentro del titulo o del contenido entonces sacamos los articulos que coincidan
                "$or": [
                    { "title": { "$regex": searchString, "$options": "i" } },
                    { "content": { "$regex": searchString, "$options": "i" } },
                ]
            }).sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {

                if (err) {
                    return res.status(300).send({
                        status: 'error',
                        message: 'Error en la peticion!!'
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu búsqueda!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });

            });

    }





}; //End controller

module.exports = controller;