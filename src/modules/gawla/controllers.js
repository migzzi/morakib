
const Gawla = require("./models").Gawla;
const penaltyClass = require("./models").PenaltyClass;
const penalty = require("./models").Penalty;


exports.getHome = (req,res)=>{
    res.render('index')
};

exports.getAddGawla = (req,res)=>{
    
    penaltyClass.findAll()
    .then(result => {
        console.log(result[0]);
    }).catch(err => console.log(error));
    res.render('add-gawla')
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
    Gawla.find({wher: {id: id}}).then((gawla)=>{
        res.render('gawla/edit-gawla',{gawla: gawla});
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