const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Tb_Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },

    senha: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    tipoUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Tb_Usuario",
    timestamps: false,
  }
);

module.exports = Usuario;