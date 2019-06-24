
const   adminRouter = require("express").Router(),
        multer = require("multer"),
        bcrypt = require("bcrypt"),
        isAdmin = require("../auth/middleware").checkRole("admin"),
        config = require("../../../config/config.json")[process.env.APP_ENV || "development"],
        {User, Role} = require("../auth/models"),
        {Penalty, Gawla, PenaltyClass, PenaltyTerm, PenaltyType} = require("../gawla/models");

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
                avatar: req.file.filename || "default.png",
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

function deleteUser(model){
    return (req, res) => {
        model.destroy({where: {id: req.params.id}})
        .then(affectedRows => {
            if(affectedRows > 0)
                return res.json({
                    success: true,
                    msg: "deleted succeessfully"
                });
            return res.json({
                error: true,
                msg: "no such resource with specified ID"
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
        // if(edit && req.user[param] != req.params[param] && req.decodedToken.role.role != "admin") //check if the current user is the resource owner or is admin
        //     return res.render("auth/not_authorized");
        let filter = role ? {role: role} : {};
        User.findOne({
            include: [{model: Role, as: "role", where: filter}, {model: User, as: "manager"}],
            where: {[param]: req.params[param]}
        }).then(user => {
            if(!user)
              return res.render("resource_not_found");
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

function updateUser(api=true, success_page="/admin/profile", param="id"){
    return function(req, res){
        // if(req.user[param] != req.params[param] && req.decodedToken.role.role != "admin") //check if the current user is the resource owner or is admin
        //     return res.render("auth/not_authorized");
        let user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
        };
        if(req.file) user.avatar = req.file.filename;
        let userRole = req.decodedToken.role.role;
        if(userRole == "admin")
            user["roleId"] ; req.body.role;
        let updateProm = null;

        // return Role.findOne({where: {role: req.body.role}})
        // .then((role) => {
        if(req.body.manager && userRole == "admin"){
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
            if(api) return res.json({
                success: true,
                username: user.username,
                msg: "employee updated successfully!"
            });
            return res.render(success_page);
        }).catch(err => {
            console.log(err);
            if(api) return res.json({
                error: true,
                type: err.errors[0].type,
                path: err.errors[0].path,
                msg: "something went wrong"
            });
            return res.render(success_page);
        });
    };
}

function getUsers(role_ = null){
    return (req, res) => {
        let roleFilter = {} , role = role_ || req.query.role, userFilter = req.params;
        if(role){
            //Get users of specific role.
            roleFilter = {where: {role: role}};
            Role.findOne(roleFilter)
            .then((role) => {
                return User.findAll({
                    where: userFilter,
                    include: [{model: Role, as: "role", where: {id: role.id}}, {model: Penalty, as: "penalties"}]
                });
            }).then((users) => {
                return res.json({
                    success: true,
                    users: users
                });
            }).catch((err) => {
                console.log(err);
                return res.json({
                    error: true,
                    msg: "Couldn't get users"
                });
            });
        } else {
            //Get all users whatever there role is.
            User.findAll({
                where: userFilter,
                include: [{model: Role, as: "role"}, {model: Penalty, as: "penalties"}]
            })
            .then((users) => {
                return res.json({
                    success: true,
                    users: users
                });
            }).catch((err) => {
                console.log(err);
                return res.json({
                    error: true,
                    msg: "Couldn't get users."
                });
            });
        }
    };
}

function listEmployees(role, page_prefix = "list_"){
    return (req, res) => {
        return res.render(page_prefix + (role ? role : "employees"));
      }
}

function checkPenRole(role){
    let model;
    if(role == "class") model = {model: PenaltyClass, include: [{model: PenaltyType, as: "pen_types"}]};
    else if(role == "type") model = {model: PenaltyType, include: [{model: PenaltyClass, as: "pen_class"}, {model: PenaltyTerm, as: "pen_terms"}]};
    else if(role == "term") model = {model: PenaltyTerm, include: [{model: PenaltyType, as: "pen_type", include: [{model: PenaltyClass, as: "pen_class"}]}]};
    else model = {model: Penalty, include: [{model: PenaltyClass, as: "pen_class"}, {model: PenaltyType, as: "pen_type"}, {model: PenaltyTerm, as: "pen_term"}]};
    return model;
}

function getPenalty(role = null, api=false, page_name="list_pen_" + role + "s"){
    let {model, include} = checkPenRole(role);
    return (req, res) => {
        let filter = req.params || {};
        model.findAll({where: filter, include: include})
        .then(results => {
            // console.log(results[0].pen_type)
            if(api) return res.json({success: true, results: results});
            return res.render(page_name, {data: results});
        }).catch(err => {
            console.log(err)
            if(api) return res.json({error: true, msg: "something wrong is happened!" + err});
            return res.render("error");
        });
    };
}

function deletePenalty(role, api=false, success_redirect_url="/penalty_" + role + "s", error_redirect_url="/penalty_" + role + "s"){
    let {model} = checkPenRole(role);
    return (req, res) => {
        model.destroy({where: {id: req.params.id}})
        .then((rowsAffected) => {
            if(rowsAffected > 0){
                if(api) return res.json({success: true, msg: "row deleted successfully!"});
                return res.redirect(success_redirect_url);
            } else {
                if(api) return res.json({error: true, msg: "can't delete this resource!"});
                return res.redirect(error_redirect_url);                
            }
        }).catch(err => {
            if(api) return res.json({error: true, msg: "can't delete this resource!"});
            return res.redirect(error_redirect_url); 
        });
    };
} 

function addPenalty(role, api=false, success_redirect_url="/penalty_" + role + "s", error_redirect_url="/penalty_" + role + "s"){
    let {model} = checkPenRole(role);
    return (req, res) => {
        let modelObj = req.body;
        // console.log(req.body);
        // let addons = req.body.addons;
        // if(addons) modelObj[addons] = addons;
        model.create(modelObj)
        .then(result => {
            if(result){
                if(api) return res.json({success: true, msg: "resource created successfully!", result: result});
                return res.redirect(success_redirect_url);
            } else {
                if(api) return res.json({error: true, msg: "can't create resource!"});
                return res.redirect(error_redirect_url);
            }
        }).catch(err => {
            console.log(err);
            if(api) return res.json({error: true, msg: "can't create resource!"});
            return res.redirect(error_redirect_url);
        });
    };
}

function updatePenalty(role, api=false, success_redirect_url="/penalty_" + role + "s", error_redirect_url="/penalty_" + role + "s"){
    let {model} = checkPenRole(role);
    return (req, res) => {
        let modelObj = {
            name: req.body.name,
            desc: req.body.desc,
            addons: req.body.addons,
        };
        let addons = req.body.addons;
        if(addons) modelObj[addons] = addons;
        model.update(modelObj, {where: {id: req.params.id}})
        .then(results => {
            if(results.length > 0){
                if(api) return res.json({success: true, msg: "updated successfully!"});
                return res.redirect(success_redirect_url);
            } else {
                if(api) return res.json({error: true, msg: "can't updated resource!"});
                return res.redirect(error_redirect_url);
            }
        }).catch(err => {
            if(api) return res.json({error: true, msg: "can't updated resource!"});
            return res.redirect(error_redirect_url);
        });
    };
}
module.exports.addUserGet = addUserGet;
module.exports.addUserPost = addUserPost;
module.exports.deleteUser = deleteUser;
module.exports.displayUser = displayUser;
module.exports.getUsers = getUsers;
module.exports.updateUser = updateUser;
module.exports.listEmployees = listEmployees;
module.exports.getPenalty = getPenalty;
module.exports.deletePenalty = deletePenalty;
module.exports.addPenalty = addPenalty;
module.exports.updatePenalty = updatePenalty;
