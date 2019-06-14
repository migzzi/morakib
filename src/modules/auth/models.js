const Sequelize = require("sequelize"),
      db = require("../../database/connection");


const IDType = {
    type: Sequelize.INTEGER(11),
    allowNull:false,
    autoIncreemnt: true,
    primaryKey: true
};

const User = db.define("user", {
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
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING(50),
        allowNull: true
    }

}, {
    underscored: true,
    sequelize: db
});

const Role = db.define("role", {
    role: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    desc: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    sequelize: db
});

User.belongsTo(Role);
Role.hasMany(User);

exports.User = User;
exports.Role = Role;