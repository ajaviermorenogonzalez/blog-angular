'use strict'

var validator = require('validator');
var Article = require('../models/article');
const { param } = require('../routes/article');

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

    }



}; //End controller

module.exports = controller;