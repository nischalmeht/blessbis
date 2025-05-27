// const { DataTypes, UUIDV4 } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../utils/sql');

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: UUIDV4,
//     primaryKey: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//     validate: {
//       isEmail: true,
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   tableName: 'users',
//   timestamps: true,
// });

// // ✅ Sequelize hook to hash password before save
// User.beforeCreate(async (user) => {
//   if (user.password) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
// });

// User.beforeUpdate(async (user) => {
//   if (user.changed('password')) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
// });

// // ✅ Instance method for password comparison
// User.prototype.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // ✅ Instance method for JWT generation
// User.prototype.generateToken = function () {
//   return jwt.sign(
//     { id: this.id, email: this.email },
//     process.env.JWT_SEC,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );
// };

// module.exports = User;
