const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contact = require('./contact');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

User.hasMany(Contact, { as: 'contacts', foreignKey: 'userId' });
// Contact.belongsTo(User, { as: 'owner', foreignKey: 'userId' });

module.exports = User;

