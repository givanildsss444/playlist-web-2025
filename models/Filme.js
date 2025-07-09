import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Filme = sequelize.define('Filme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, 
      },
    },
    ano_lancamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1895, 
        max: new Date().getFullYear(), 
      },
    },
    nota_avaliacao: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 10,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'filmes',
    timestamps: false,
  });

  return Filme;
};
