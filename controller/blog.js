

let moment = require('moment');

const Article = require('../models').Article;
const Website = require('../models').Website;
const Category = require('../models').Category;

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

    if (req.query.page) {
        page = req.query.page;
    }

    if (req.query.cate_id) {
        categoryId = req.query.cate_id;
    }




    Website.findOne().then(function(webinfo){   //网站相关信息查询
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

        let options = {
            order: [['id', 'DESC']],
            limit: limit,
            offset: (page-1)*limit,
            where:{}
        };

        if (categoryId > 0) {
            options.where.CategoryId = categoryId;
        }

        locals['categoryId'] = categoryId;


        Category.findAll().then(function(categories){
            locals['categories'] = categories;

            Article.findAndCount(options).then(function(articles){  // 按照条件查询文章

                let pagination = []

                for (let i = 1; i <= Math.ceil(articles.count/limit); i++) {
                    pagination.push({
                        tag:i+'',
                        link:'/?' + (categoryId > 0 ? 'cate_id=' + categoryId + '&' : '') +'page=' + i
                    })
                }


                
                for (let i = 0; i < articles.rows.length; i++) {
                    articles.rows[i]['date'] = moment(articles.rows[i]['createdAt']).format("YYYY-MM-DD hh:mm:ss");
                    console.log(articles.rows[i]['createdAt']);
                }

                locals['articles'] = articles.rows;
                locals['total'] = articles.count;
                locals['pagination'] = pagination;

                //console.log(articles);

                return res.render('blog', locals)
            });
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