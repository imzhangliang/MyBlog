var express = require('express');
var router = express.Router();
var controller = require('../controller/blog');
var Category = require('../models').Category;

/* GET home page. */
router.get('/', controller.display);

router.get('/post', controller.postDisplay);

router.post('/post', controller.post);

module.exports = router;
