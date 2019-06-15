
const   adminRouter = require("express").Router(),
        multer = require("multer"),
        bcrypt = require("bcrypt"),
        isAdmin = require("../auth/middleware").checkRole("admin"),
        config = require("../../../config/config.json")[process.env.APP_ENV || "development"],
        {User, Role} = require("../auth/models");

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

function addUserGet(){
    return (req, res) => {
        return Role.findAll().then(roles => {
            return res.render("admin/profile_add", {targetUser: new User({avatar: "default.png"}), roles, edit: false});
        });
    };
}

function addUserPost(){
    return function(req, res){
        bcrypt.hash(req.body.password, saltRoundsCount)
        .then( hashedPassword => {
            // return Role.findOne({where: {role: req.body.role}})
            // .then((role) => {
            let user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.file.filename,
                roleId: req.body.role,
            };
            if(req.body.manager){
                return User.findOne({where: {id: req.body.manager}, include: [{model: Role, as: "role", where: {role: "manager"}}]})
                .then(manager => {
                    if(!manager)
                        throw Error("Not valid manager");
                    user.managerId = manager.id;
                    return User.create(user);
                });
            }
            return User.create(user);
        })
        .then(user => {
            console.log(user);
            return res.json({
                success: true,
                msg: "employee added successfully!"
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                error: true,
                msg: "something went wrong"
            });
        });
    };
}

function deleteUser(){
    return (req, res) => {
        User.destroy({where: {id: req.params.id}})
        .then(affectedRows => {
            if(affectedRows > 0)
                return res.json({
                    success: true,
                    msg: "user deleted succeessfully"
                });
            return res.json({
                error: true,
                msg: "no such user with specified ID"
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                error: true,
                msg: "something went wrong"
            });
        });
    }
}

function displayUser(role=null, edit=false, param="id"){
    return (req, res) => {
    
        let filter = role ? {role: role} : {};
        console.log({[param]: req.params[param]}, filter)
        User.findOne({
            include: [{model: Role, as: "role", where: filter}],
            where: {[param]: req.params[param]}
        }).then(user => {
            if(!user)
              return res.render("admin/resource_not_found");
            if(!edit)
                return res.render("admin/profile", {targetUser: user});
            return Role.findAll().then((roles) => {
                return res.render("admin/profile_edit", {targetUser: user, roles, edit});
              });
          })
          .catch((err) => {
            console.log(err);
            return res.render("admin/error");
          });
    };
}

function updateUser(){
    return function(req, res){
        let user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            avatar: req.file.filename,
            roleId: req.body.role,
        };
        let updateProm = null;

        // return Role.findOne({where: {role: req.body.role}})
        // .then((role) => {
        if(req.body.manager){
            updateProm =  User.findOne({where: {id: req.body.manager}, include: [{model: Role, as: "role", where: {role: "manager"}}]})
            .then(manager => {
                if(!manager)
                    throw Error("Not valid manager");
                user.managerId = manager.id;
                return User.update(user, {where: {id: req.params.id}});
            });
        }
        else updateProm = User.update(user, {where: {id: req.params.id}});
        updateProm.then(user => {
            return res.json({
                success: true,
                msg: "employee updated successfully!"
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                error: true,
                msg: "something went wrong"
            });
        });
    };
}

function getUsers(role_ = null){
    return (req, res) => {
        let filter = {} , role = role_ || req.query.role;
        if(role){
            //Get users of specific role.
            filter = {where: {role: role}};
            Role.findOne(filter)
            .then((role) => {
                return User.findAll({
                    include: [{model: Role, as: "role", where: {id: role.id}}]
                });
            })
            .then((users) => {
                return res.json({
                    success: true,
                    users: users
                });
            })
            .catch((err) => {
                console.log(err);
                return res.json({
                    error: true,
                    msg: "Couldn't get users"
                });
            });
        } else {
            //Get all users whatever there role is.
            User.findAll({
                include: [{model: Role, as: "role"}]
            })
            .then((users) => {
                return res.json({
                    success: true,
                    users: users
                });
            })
            .catch((err) => {
                console.log(err);
                return res.json({
                    error: true,
                    msg: "Couldn't get users."
                });
            });
        }
    };
}


module.exports.addUserGet = addUserGet;
module.exports.addUserPost = addUserPost;
module.exports.deleteUser = deleteUser;
module.exports.displayUser = displayUser;
module.exports.getUsers = getUsers;
module.exports.updateUser = updateUser;