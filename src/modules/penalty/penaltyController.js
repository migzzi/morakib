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
        return penaltyTypeModel.findAll({where:{penaltyClassId: result.id}});
    })
    .then(result => {
        response.json({penaltyTypes:result});
    }).catch(error => console.log(error));
}


exports.getPenaltyTerm = (request,response) => {
    penaltyTypeModel.findOne({where:{name:request.params.penaltyTerm}})
    .then(result => {
        return penaltyTermModel.findAll({where:{penaltyTypeId:result.id}});
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
                if(penaltyName  && PClass.id && PType.id && PTerm.id ){
                    console.log("yarb");
                    penaltyModel.create({
                        value: penaltyName,
                        comment: penaltyDesc,
                        state: "pending",
                        penaltyUserIdId: 1,
                        gawlaId: 1,
                        penaltyClassIdId: 1,
                        penaltyTypeIdId: 1,
                        penaltyTermIdId: 1
                    });
                    response.redirect("/penalty/penalties");
                }else{
                    console.log("yarb")
                }
            })
        })
    }).catch(error => console.log("penaltyClassID : ",error));
}

exports.getPenalties = (request,response) => {
    penaltyModel.findAll({include: [
        {model: penaltyClassModel ,as: 'penaltyClassId'},
        {model: userModel ,as: 'penaltyUserId'},
    ]})
    .then(penalties => {
        console.log(penalties);
        response.render("supers",{"penalties": penalties});   
    }).catch(error => console.log(error));
}