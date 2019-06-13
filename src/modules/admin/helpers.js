
const   adminRouter = require("express").Router(),
        multer = require("multer"),
        bcrypt = require("bcrypt"),
        isAdmin = require("../auth/middleware").checkRole("admin"),
        config = require("../../../config/config.json"),
        {User, Role} = require("../auth/models");

function addUser(role){
    return function(req, res){
        console.log(req.body);
        bcrypt.hash(req.params.password, saltRoundsCount)
        .then( hashedPassword => {
            return Role.findOne({where: {role: role}})
            .then((role) => {
                return User.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    avatar: req.file.filename,
                    role_id: role.id
                });
            });
        })
        .then(user => {
            console.log(user);
            return res.json({
                success: true,
                msg: role + " added successfully!"
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

function displayUser(role, edit = false){
    return (req, res) => {
        User.findOne({
            include: [{model: Role, as: "role", where: {role: role}}],
            where: {id: req.params.id}
        }).then(user => {
            if(!user)
              return res.render("admin/resource_not_found");
            if(!edit)
                return res.render("admin/profile", {user});
            return Role.findAll().then((roles) => {
                return res.render("admin/profile_edit", {user, roles});
              });
          })
          .catch((err) => {
            console.log(err);
            return res.render("admin/error");
          });
    };
}

function updateUser(role){
    return (req, res) => {
        User.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: erq.body.email
        })
    }
}


module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.displayUser = displayUser;