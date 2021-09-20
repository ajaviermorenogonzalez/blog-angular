'use strict'

var controller = {

    test: (req, res) => {

        return res.status(200).send({
            message: "Soy la accion test de mi controlador de articulos"
        })

    }

}; //End controller

module.exports = controller;