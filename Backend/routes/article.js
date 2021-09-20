'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.findAll);
router.get('/article/:id', ArticleController.findOne);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);

module.exports = router;