const penaltyClassModel = require("../gawla/models").PenaltyClass;
const penaltyTypeModel = require("../gawla/models").PenaltyType;
const penaltyTermModel = require("../gawla/models").PenaltyTerm;



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