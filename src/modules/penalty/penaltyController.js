const penaltyModel = require("../gawla/models").Penalty;
const penaltyClassModel = require("../gawla/models").PenaltyClass;
const penaltyTypeModel = require("../gawla/models").PenaltyType;
const penaltyTermModel = require("../gawla/models").PenaltyTerm;
const userModel = require("../auth/models").User;



exports.getAddPenalty = (request,response) => {
    penaltyClassModel.findAll()
    .then(result => {
        response.render("penalty/add-penalty",{penaltyClasses:result});
    }).catch(error => console.log(error));
}

exports.getPenaltyType = (request,response) => {
    penaltyClassModel.findOne({where:{name:request.params.penaltyClass}})
    .then(result => {
        return penaltyTypeModel.findAll({where:{pen_class_id: result.id}});
    })
    .then(result => {
        console.log(result)
        response.json({penaltyTypes:result});
    }).catch(error => console.log(error));
}


exports.getPenaltyTerm = (request,response) => {
    penaltyTypeModel.findOne({where:{name:request.params.penaltyTerm}})
    .then(result => {
        return penaltyTermModel.findAll({where:{pen_type_id:result.id}});
    })
    .then(result => {
        response.json({penaltyTerms:result});
    }).catch(error => console.log(error));
}

exports.getPostPenalty = (request,response) => {
    let penaltyName = request.body.penaltyName;
    let penaltyDesc = request.body.penaltyDesc;
    let penaltyClass = request.body.penaltyClass;
    let penaltyType = request.body.penaltyType;
    let penaltyTerm = request.body.penaltyTerm;

    penaltyClassModel.findOne({where:{name:penaltyClass}})
    .then(PClass => {
        penaltyTypeModel.findOne({where:{name:penaltyType}})
        .then(PType => {  
            penaltyTermModel.findOne({where:{name:penaltyTerm}})
            .then(PTerm => {
                if(penaltyDesc  && PClass.id && PType.id && PTerm.id ){
                    penaltyModel.create({
                        comment: penaltyDesc,
                        state: "pending",
                        inspector_id: request.user.id,
                        gawla_id: 1,
                        pen_class_id: PClass.id,
                        pen_type_id: PType.id,
                        pen_term_id: PTerm.id
                    });
                    response.redirect("/penalty/test");
                }else{
                    console.log("yarb")
                }
            })
        })
    }).catch(error => console.log("penaltyClassID : ",error));
}


exports.test = (request,response) => {
    response.redirect("/penalty/penalties");
}

exports.getPenalties = (request,response) => {
    penaltyModel.findAll({where:{state:"pending"},include: [
        {model: penaltyClassModel ,as: 'pen_class'},
        {model: penaltyTermModel ,as: 'pen_term'},
        {model: userModel ,as: 'inspector'},
    ]})
    .then(penalties => {
        penaltyClassModel.findAll()
        .then(penaltyClasses => {
            userModel.findAll()
            .then(users => {
                response.render("supers",{"penalties": penalties,"classes":penaltyClasses,"users":users});   
            })
        })
    }).catch(error => console.log(error));
}


exports.getPenaltyApproved = (request,response) => {
    penaltyModel.findAll({where:{state:"approved"},include: [
        {model: penaltyClassModel ,as: 'pen_class'},
        {model: penaltyTermModel ,as: 'pen_term'},
        {model: userModel ,as: 'inspector'},
    ]})
    .then(penalties => {
        penaltyClassModel.findAll()
        .then(penaltyClasses => {
            userModel.findAll()
            .then(users => {
                response.render("penalty/approved-penalty",{"penalties": penalties,"classes":penaltyClasses,"users":users});   
            })
        })
    }).catch(error => console.log(error));
}



exports.postDeletePenalty = (request,response)=>{
    penaltyModel.destroy({where: {id: request.params.id}})
    .then(affectedRows => {
        if(affectedRows > 0)
            return response.json({
                success: true,
                msg: "تم مسح الجولة بنجاح"
            });
        return response.json({
            error: true,
            msg: "لايوجد جولة بهذه المواصفات"
        });
    })
    .catch(err => {
        console.log(err);
        return response.json({
            error: true,
            msg: "حدث خطأ ما "
        });
    });
}


exports.getPenaltyUpdate = (request,response) => {
    let penaltyId = request.params.id;
    penaltyModel.update({state:"approved"},{where:{id:penaltyId}})
    .then(result => {
        if(affectedRows > 0)
            return response.json({
                success: true,
                msg: "تم تحديث الجولة بنجاح"
            });
        return response.json({
            error: true,
            msg: "لايوجد جولة بهذه المواصفات"
        });
    })
    .catch(err => {
        console.log(err);
        return response.json({
            error: true,
            msg: "حدث خطأ ما "
        });
    });
}