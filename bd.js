const Sequelize = require('sequelize');

const sequelize = new Sequelize('backend', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log('Banco conectado com sucesso');
})
.catch(err => {
    console.log('Erro ao conectar:', err);
});

module.exports = sequelize;
