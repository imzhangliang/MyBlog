

let moment = require('moment');

const Article = require('../models').Article;
const Website = require('../models').Website;
const Category = require('../models').Category;

//博客主页的显示
const display = function(req, res, next) {
    Website.findOne().then(function(webinfo){
        console.log(webinfo);
        webinfo.website_title = webinfo.title;
        webinfo.website_description = webinfo.description;
        console.log(webinfo.copyright)

        let locals = {
            'website_title': webinfo.title,
            'website_description': webinfo.description,
            'copyright': webinfo.copyright,
            'email': webinfo.email,
            'company': webinfo.company,
        };

        Article.findAll().then(function(articles){
            locals['articles'] = articles;
            for (let i = 0; i < articles.length; i++) {
                console.log(articles[i]['createdAt']);
                console.log(moment());
                console.log(moment(articles[i]['createdAt']).format("YYYY-MM-DD hh:mm:ss"));
                articles[i]['date'] = moment(articles[i]['createdAt']).format("YYYY-MM-DD hh:mm:ss");
                console.log(articles[i]['createdAt']);
            }

            console.log(articles);

            return res.render('blog', locals)
        });
        
        //return res.render('blog', locals);
    })    

    
}

//发文章页面的显示
const postDisplay = function(req, res, next) {
    let categories = Category.findAll({}).then(function(categories){
        console.log(categories);

        res.render('post', {'categories': categories})
    });
}

const post = function(req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.category_id;

    Article.postArticle(title, content, categoryId).then(function(result){
        return res.jsonp(result);
    })
}




module.exports = {
    display:display,
    postDisplay: postDisplay,
    post:post,
}