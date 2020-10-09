const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameResponse.belongsTo(models.Game, {
        foreignKey: 'gameID',
        onDelete: 'CASCADE',
        as: 'game',
      });

      GameResponse.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
        as: 'owner',
      });
    }
  }
  GameResponse.init(
    {
      userID: { type: DataTypes.INTEGER, allowNull: false },
      gameID: { type: DataTypes.INTEGER, allowNull: false },
      response: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'GameResponse',
    },
  );
  return GameResponse;
};
