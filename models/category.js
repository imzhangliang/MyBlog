'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.Article);
    // associations can be defined here
  };
  return Category;
};