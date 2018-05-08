var express = require('express');
var router = express.Router();
var controller = require('../controller/blog');
var Category = require('../models').Category;

/* GET home page. */
router.get('/', controller.display);

//显示某一文章
router.get('/article', controller.displayArticle);

//显示添加文章页面
router.get('/post', controller.postDisplay);

//添加文章
router.post('/post', controller.post);

module.exports = router;
