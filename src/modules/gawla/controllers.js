
const Gawla = require("./models").Gawla,
        Class = require('./models').PenaltyClass,
        User = require('../auth/models').User,
        Role = require('../auth/models').Role;

exports.getHome = (req,res)=>{
    res.render('index')
};

exports.getAddGawla = (req,res)=>{
    Role.findOne({where: {role: 'inspector'}})
    .then(role =>{
        User.findAll({where: {roleId: role.id}})
        .then(users=>{
            Class.findAll()
            .then(classes=>{
                res.render('gawla/add-gawla',{users: users, classes: classes, msg: ""});
            })
        })
    }).catch(err =>{
        console.log(err);
    })
    // Class.findAll().then((classes)=>{
    //     User.findAll({where:{id:3}}).then((inspectors)=>{
    //         console.log(inspectors);
    //         res.render('gawla/add-gawla',{'classes' : classes, inspectors: inspectors}); 
    //     })
    //     }).catch((err)=>{
    //         console.log("classes"+err);

    //     })
};

exports.postAddGawla = (req,res)=>{
    // console.log(req.body);
    const name_ = req.body.name;
    const phone = req.body.phone;
    const class_id = parseInt(req.body.type);
    const address = req.body.address;
    const liscene_num = req.body.liscene_num;
    const target_ = req.body.target;
    const inspector_id = parseInt(req.body.inspector);
    // console.log(parseInt(class_id));


  Gawla.create({
      name : name_,
      Address : address,
      done : false,
      target : target_,
      licesnce_no: liscene_num,
      phone_no : phone,
      long : 44.5,
      lat : 55.7,
      manager_id: 2,
      inspector_id: inspector_id,
      class_id: class_id,

    }).then((result)=>{
        // console.log(result);
        res.redirect("/gawlat");
    }).catch((err)=>{
        res.render('gawla/add-gawla',{msg: 'Please enter the mising fields....'})
    })

};

exports.getGawlat = (req, res)=>{
    // let userRole = req.user.getRole();
    // let filter = userRole == "admin" ? {} : (userRole == "manager" ? {manager_id: req.user.id} : {inspector_id: req.user.id});
    // Gawla.findAll({where: filter})
    // .then((gawlat) => {
    //     res.render("gawlat", {gawlat: gawlat});
    // })
    // .catch((err) => {
    //     console.log(err);
    //     res.render("error", {error: err});
    // })
    Gawla.findAll().then((gawlat)=>{
        console.log(gawlat);
        res.render('gawla/gawlat',{gawlat : gawlat});
    }).catch((err)=>{
        console.log("gawlat"+err);
    })
};

exports.getEditGawla = (req,res)=>{
    const id = req.params.id;
    console.log(id);
    Gawla.findOne({where: {id: id}}).then((gawla)=>{
        console.log(gawla)
        Role.findOne({where: {role: 'inspector'}})
        .then((role)=>{
            return User.findAll({where:{roleId: role.id}})
        })
        .then(users => {
             Class.findAll()
            .then(classes=> {
                 res.render('gawla/edit-gawla', {users: users, gawla: gawla, classes: classes});
            })
        })
    }).catch((err)=>{
        console.log(err);
        res.render('error',{err: err});
    })
};

exports.postEditGawla = (req,res)=>{
    
};

exports.getSupers = (req,res)=>{
    res.render('supers')
};