const Sequelize = require("sequelize"),
      db = require("../../database/connection");


const IDType = {
    type: Sequelize.INTEGER(11),
    allowNull:false,
    autoIncreemnt: true,
    primaryKey: true
};

const User = db.define("user", {
    id: IDType,
    first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false
    },

});

const Role = db.define("role", {
    id: IDType,
    role: {
        type: Sequelize.ENUM(["admin", "manager", "inspector"]),
        allowNull: false
    },
    desc: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

exports.User = User;
exports.Role = Role;