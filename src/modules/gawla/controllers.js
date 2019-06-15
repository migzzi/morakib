
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