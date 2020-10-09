const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.GameResponse, {
        foreignKey: 'userID',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Game, {
        foreignKey: 'hostId',
        as: 'hostedGames',
      });

      User.hasMany(models.Game, {
        foreignKey: 'guestId',
        as: 'guestGames',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User',
    },
  );
  return User;
};
