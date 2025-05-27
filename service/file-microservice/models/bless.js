'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class bless extends Model {
    static associate(models) {
      // define associations here
    }
  }

  bless.init({
    url: { type: DataTypes.STRING, allowNull: false },
  public_id: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.STRING, allowNull: true },
  // createdBy: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'bless',
    tableName: 'bless', // ✅ this prevents Sequelize from using "blesses"
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    timestamps: true
  });

  return bless;
};
