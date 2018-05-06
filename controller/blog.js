

let moment = require('moment');

const Article = require('../models').Article;
const Website = require('../models').Website;
const Category = require('../models').Category;
const Tag = require('../models').Tag;

const _ = require('lodash');

//博客主页的显示
const display = function(req, res, next) {
    /*
    * get参数： 
    *  1. cate_id: 分类id
    *  2. page: 页码
    */
    //分页信息
    let page = 1;
    let limit = 4;
    let categoryId = 0;
    let tagId = 0;
    let pagination = {
        page: page,
        limit: limit
    };

    if (req.query.page) {
        page = req.query.page;
    }

    if (req.query.cate_id) {
        categoryId = req.query.cate_id;
    }

    if (req.query.tag_id) {
        tagId = req.query.tag_id;
    }


    Article.queryByCategory(categoryId, pagination).then(function(locals){
        console.log(locals);
        return res.render('blog', locals);
    })

    
}

//发文章页面的显示
const postDisplay = function(req, res, next) {
    let categories = Category.findAll({}).then(function(categories){
        console.log(categories);

        Tag.findAll().then(function(tags){
            res.render('post', {
                'categories': categories,
                'tags':tags
            })
        })
        
    });
}

const post = function(req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.category_id;
    let tagId0 = req.body['tag_id[0]'];
    let tagId1 = req.body['tag_id[1]'];
    let tagId2 = req.body['tag_id[2]'];
    let tagIds = [tagId0, tagId1, tagId2];
    console.log(tagIds);
    tagIds = Array.from(new Set(tagIds));

    console.log(tagIds);
    _.remove(tagIds, function(e){
        return e === undefined || e == '0';
    });

    console.log(tagIds);

    Article.postArticle(title, content, categoryId, tagIds).then(function(result){
        return res.jsonp(result);
    })
}




module.exports = {
    display:display,
    postDisplay: postDisplay,
    post:post,
}