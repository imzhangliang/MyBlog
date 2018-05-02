'use strict';
module.exports = (sequelize, DataTypes) => {
  var Website = sequelize.define('Website', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    copyright: DataTypes.STRING,
    company: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  Website.associate = function(models) {
    // associations can be defined here
  };
  return Website;
};