'use strict';
const { Model } = require('sequelize');
const { GAME_STATUSES } = require('../../config/constants');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Game.hasMany(models.GameResponse, {
        foreignKey: 'gameID',
        onDelete: 'CASCADE',
        as: 'responses',
      });

      // host
      Game.belongsTo(models.User, {
        foreignKey: 'hostId',
        targetKey: 'id',
        as: 'host',
      });

      // guest
      Game.belongsTo(models.User, {
        foreignKey: 'guestId',
        targetKey: 'id',
        as: 'guest',
      });
    }
  }
  Game.init(
    {
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      guestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chosenWord: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(GAME_STATUSES),
        defaultValue: GAME_STATUSES.PENDING,
        allowNull: false,
      },
      winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Game',
      timestamps: true,
    },
  );
  return Game;
};
