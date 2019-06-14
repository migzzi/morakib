
const Gawla = require("./models").Gawla;

exports.getHome = (req,res)=>{
    res.render('index')
};

exports.getAddGawla = (req,res)=>{
    res.render('add-gawla')
};

exports.postAddGawla = (req,res)=>{
    const name_ = req.body.name;
    const phone = req.body.phone;
    const type = req.body.type;
    const address = req.body.address;
    const liscene_num = req.body.liscene_num;
    const target_ = req.body.target;

  Gawla.create({
      name : name_,
      done : false,
      target : target_,
      licesnce_no: liscene_num,
      phone_no : phone,
      long : 44.5,
      lat : 55.7,
    }).then((result)=>{
        console.log(result);
        res.redirect("/");
    }).catch((err)=>{
        console.log(err);
    })

};

exports.getGawlat = (req, res)=>{
    let userRole = req.user.getRole();
    let filter = userRole == "admin" ? {} : (userRole == "manager" ? {manager_id: req.user.id} : {inspector_id: req.user.id});
    Gawla.findAll({where: filter})
    .then((gawlat) => {
        res.render("gawlat", {gawlat: gawlat});
    })
    .catch((err) => {
        console.log(err);
        res.render("error", {error: err});
    })
};

exports.getSupers = (req,res)=>{
    res.render('supers')
};