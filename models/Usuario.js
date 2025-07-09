import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true,
      },
    },
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

  return Usuario;
};
