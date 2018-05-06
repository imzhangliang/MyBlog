'use strict';

module.exports = (sequelize, DataTypes) => {
  var Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    content: DataTypes.STRING
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

  return Article;
};