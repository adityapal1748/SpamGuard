const {Sequelize} = require('sequelize');
require('dotenv').config(); 


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host:  process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

// const models = {
//   User: require('./user')(sequelize, Sequelize.DataTypes),
//   Contact: require('./contact')(sequelize, Sequelize.DataTypes),
// };

// Object.keys(models).forEach(modelName => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;

module.exports = sequelize;
