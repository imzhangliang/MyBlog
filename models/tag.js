'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Article, {through: 'articleTag'})
    // associations can be defined here
  };

  Tag.getAllTags = function() {
    const Article = require('../models').Article;

    return Tag.findAll({
      //attributes: ['Tag.*', [sequelize.fn('COUNT', 'Article.id'), 'articleCount']],
      include: {
        attributes: ['id'],
        model: Article
      },
      logging: true
    }).then(function(tags){
      for (let i = 0; i < tags.length; i++) {
        tags[i].count = tags[i].Articles.length;
      }
      return tags;
    });
  }

  return Tag;
};