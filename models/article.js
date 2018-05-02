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

  Article.postArticle = function(title, content, categoryId) {
    return Article.create({
      title:title,
      content:content,
      CategoryId: categoryId
    });
  }

  return Article;
};