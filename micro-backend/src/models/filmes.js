const { DataTypes } = require("sequelize");

const filmes = (sequelize, DataTypes)=>{
    const Filmes = sequelize.define('Filmes',{
        id_Filme:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
      
          nome_filme:{
            type: DataTypes.STRING,
            allowNull: false,
          },
      
          descricao:{
            type: DataTypes.STRING,
          },
      
          avaliacao:{
            type: DataTypes.FLOAT
          },
      
          data_lancamento:{
            type: DataTypes.DATEONLY
          },
          
          image:{
            type: DataTypes.STRING
          }
    },  
    {
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'filmes',
        foreignKey: false
    })
    return Filmes; 
}

module.exports = filmes