const {Sequelize} = require('sequelize');
const config = require("../config/config.json")

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

const { username, password, database, host, dialect } = envConfig;

const sequelize = new Sequelize(database, username, password, {
    host:  host,
    dialect: dialect,
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
