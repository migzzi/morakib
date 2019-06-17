
const Gawla = require("./models").Gawla,
        Class = require('./models').PenaltyClass,
        User = require('../auth/models').User,
        Role = require('../auth/models').Role;

const NodeGeocoder = require('node-geocoder');


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
   
};

exports.postAddGawla = (req,res)=>{
    // console.log("++++++",req.body);
    const name_ = req.body.name;
    const phone = req.body.phone;
    const class_id = req.body.class_id;
    const address = req.body.address;
    const liscene_num = req.body.liscene_num;
    const target_ = req.body.target;
    const inspector_id = req.body.inspector_id;
    // console.log("class",class_id);
    // console.log("inspector",inspector_id);



  Gawla.create({
      name : name_,
      Address : address,
      done : false,
      target : target_,
      licesnce_no: liscene_num,
      phone_no : phone,
      long : 44.5,
      lat : 55.7,
      manager_id: req.user.id,
      inspector_id: inspector_id,
      pen_class_id: class_id,

    }).then((result)=>{
        // console.log(result);
        res.json({
            success: true,
            
        })
    }).catch((err)=>{
        console.log(err);
        res.json({
            error: true,
            msg: "من فضلك ادخل البيانات الناقصة",
        })
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
    Gawla.findAll({include: [{model: Class, as: "pen_class"},{model: User,as:'inspector'}]}).then((gawlat)=>{
        console.log(gawlat);
        res.render('gawla/gawlat',{gawlat : gawlat});
    }).catch((err)=>{
        console.log("gawlat"+err);
    })
};


exports.getGawla = (req,res)=>{
    Gawla.findOne({where: {id: req.params.id}, include: [{model: Class, as: "pen_class"},
    {model: User,as:'inspector'}]}).then((gawla)=>{
        res.render('gawla/gawla',{gawla: gawla});
    }).catch((err)=>{
        console.log("gawla"+err);
        res.render('error');
    })
};

exports.getlocationApi = (req,res)=>{
    let options = {
        provider: 'google',
       
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyCzVBN5Lp5-Ge7FpX22nEd7ClKFkjN87Xs', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
      };
      var geocoder = NodeGeocoder(options);
      geocoder.geocode('29 القاهرة مصر' )
     .then(function(result) {
      console.log(result);
     })
     .catch(function(err) {
        console.log(err);
     });
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
   
    let editedGawla = {
        name : req.body.name,
      Address : req.body.address,
      done : false,
      target : req.body.target,
      licesnce_no: req.body.liscene_num,
      phone_no : req.body.phone,
      long : 44.5,
      lat : 55.7,
      manager_id: req.user.id,
      inspector_id: req.body.inspector,
      class_id: req.body.type,
    }
    Gawla.update(editedGawla,{where: {id: req.params.id}})
    .then(result =>{
        res.redirect('/gawlat');
    })
};

exports.postDeleteGawla = (req,res)=>{
    Gawla.destroy({where: {id: req.params.id}})
    .then(affectedRows => {
        if(affectedRows > 0)
            return res.json({
                success: true,
                msg: "تم مسح الجولة بنجاح"
            });
        return res.json({
            error: true,
            msg: "لايوجد جولة بهذه المواصفات"
        });
    })
    .catch(err => {
        console.log(err);
        return res.json({
            error: true,
            msg: "حدث خطأ ما "
        });
    });
}

