const Sequelize = require("sequelize"),
      db = require("../../database/connection"),
      User = require("../auth/models").User;



const Gawla = db.define("gawla", {
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Address: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    done: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    target: {
        type: Sequelize.ENUM(["organizaiton", "individual"]),
        allowNull: false,
    },
    licesnce_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    phone_no: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    long: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    lat: {
        type: Sequelize.DECIMAL,
        allowNull: true
    }

    }, {
        underscored: true,
        sequelize: db,
        getterMethods: {
            location(){
                return {long: this.getDataValue("long"), lat: this.getDataValue("lat")};
            }
        },
        setterMethods: {
            location(value){
                this.setDataValue("long", value.long);
                this.setDataValue("lat", value.lat);
            }
        }
});

const penalty_attrs = {
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    descrition: {
        type: Sequelize.TEXT,
        allowNull: true
    }
};

const PenaltyClass = db.define("penalty_class", penalty_attrs, {sequelize: db});

const PenaltyType = db.define("penalty_type", penalty_attrs, {sequelize: db});

const PenaltyTerm = db.define("penalty_term", Object.assign(penalty_attrs, {
    addons: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    value: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}), {sequelize: db});

const Penalty = db.define("penalty", {
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    state: {
        type: Sequelize.ENUM(["pending", "approved"]),
        allowNull: false
    },
});

Penalty.belongsTo(User, {foreignKey: "inspector_id", as: "inspector"});
User.hasMany(Penalty, {foreignKey: "inspector_id", as: "penalties"});
Penalty.belongsTo(Gawla, {foreignKey: "gawla_id", as: "gawla"});
Gawla.hasMany(Penalty, {foreignKey: "gawla_id", as: "penalties"});
Penalty.belongsTo(PenaltyClass, {foreignKey: "pen_class_id", as: "pen_class"});
PenaltyClass.hasMany(Penalty, {foreignKey: "pen_class_id", as: "penalties"});
Penalty.belongsTo(PenaltyType, {foreignKey: "pen_type_id", as: "pen_type"});
PenaltyType.hasMany(Penalty, {foreignKey: "pen_type_id", as: "penalties"});
Penalty.belongsTo(PenaltyTerm, {foreignKey: "pen_term_id", as: "pen_term"});
PenaltyTerm.hasMany(Penalty, {foreignKey: "pen_term_id", as: "penalties"});
PenaltyTerm.belongsTo(PenaltyType, {foreignKey: "pen_type_id", as: "pen_type"});
PenaltyType.hasMany(PenaltyTerm, {foreignKey: "pen_type_id", as: "pen_terms"});
PenaltyType.belongsTo(PenaltyClass, {foreignKey: "pen_class_id", as: "pen_class"});
PenaltyClass.hasMany(PenaltyType, {foreignKey: "pen_class_id", as: "pen_types"});
Gawla.belongsTo(User, {foreignKey: "inspector_id", as: "inspector"});
User.hasMany(Gawla, {foreignKey: "inspector_id", as: "inspector_gawlas"});
Gawla.belongsTo(User, {foreignKey: "manager_id", as: "manager"});
User.hasMany(Gawla, {foreignKey: "manager_id", as: "manager_gawlas"});
Gawla.belongsTo(PenaltyClass, {foreignKey: "pen_class_id", as: "pen_class"});
PenaltyClass.hasMany(Gawla, {foreignKey: "pen_class_id", as: "gawlas"});


module.exports.Penalty = Penalty;
module.exports.Gawla = Gawla;
module.exports.PenaltyClass = PenaltyClass;
module.exports.PenaltyTerm = PenaltyTerm;
module.exports.PenaltyType = PenaltyType;