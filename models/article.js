'use strict';

module.exports = (sequelize, DataTypes) => {
  var Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
    Article.belongsTo(models.Category);
    Article.belongsToMany(models.Tag, {through: 'articleTag'});
  };

  Article.postArticle = function(title, content, categoryId, tagIds) {
    let Tag = require('../models').Tag;
    
    return Article.create({
      title:title,
      content:content,
      CategoryId: categoryId
    }).then(function(article){
      // 添加文章tag
      let articleId = article.id;
      let values = [];
      for (let tagId of tagIds) {
        Tag.findOne({where:{id:tagId}}).then(function(tag){
          article.addTag(tag);
        })
      }

      return article;
    });
  }

  Article.queryByCategory = function(categoryId, pagination) {
    const Website = require('../models').Website;
    const Category = require('../models').Category;
    const Tag = require('../models').Tag;
    const moment = require('moment');

    let limit = pagination.limit;
    let page = pagination.page;

    return Website.findOne().then(function(webinfo){   //网站相关信息查询
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
          where:{},
          include: {
              model: Tag,
          }
      };

      if (categoryId > 0) {
          options.where.CategoryId = categoryId;
      }

      locals['categoryId'] = categoryId;


      return Category.findAll().then(function(categories){
          locals['categories'] = categories;

          return Article.findAndCount(options).then(function(articles){  // 按照条件查询文章

              let pagination = [] //传给view的分页变量，和上面的pagination是两个变量

              console.log('Articles Count: ' + articles.count);
              for (let i = 1; i <= Math.ceil(articles.count/limit); i++) {
                  pagination.push({
                      tag:i+'',
                      page: i,
                      link:'/?' + (categoryId > 0 ? 'cate_id=' + categoryId + '&' : '') +'page=' + i
                  })
              }


              
              for (let i = 0; i < articles.rows.length; i++) {
                  articles.rows[i]['date'] = moment(articles.rows[i]['createdAt']).format("YYYY-MM-DD hh:mm:ss");
              }

              locals['articles'] = articles.rows;
              locals['total'] = articles.count;
              locals['pagination'] = pagination;
              locals['page'] = page;

              return locals;
              //return res.render('blog', locals)
          });
      });
    })    
  }

  return Article;
};