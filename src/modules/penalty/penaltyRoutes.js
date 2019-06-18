const express = require("express");
const penaltyRouter = express.Router();
const penaltyController = require("./penaltyController");
checkRole = require('../auth/middleware').checkRole;

// get the penalty page
penaltyRouter.get("/add-penalty",checkRole('inspector'),penaltyController.getAddPenalty);
penaltyRouter.post("/add/penalty/:id",checkRole('inspector'),penaltyController.getPostPenalty);

// get the types of the penaltyRouter
penaltyRouter.get("/add-penalty/:penaltyClass",checkRole('inspector'),penaltyController.getPenaltyType);//api

// get the term of the penaltyType
penaltyRouter.get("/add-penalty/penaltyType/:penaltyTerm",checkRole('inspector'),penaltyController.getPenaltyTerm);//api

// get the penalties 
penaltyRouter.get("/penalties",checkRole(['manager','inspector']),penaltyController.getPenalties);
penaltyRouter.get("/approvedPenalty",checkRole('manager'),penaltyController.getPenaltyApproved);





penaltyRouter.delete("/delete/:id",checkRole('manager'),penaltyController.postDeletePenalty);

penaltyRouter.get("/update/:id",checkRole('manager'),penaltyController.getPenaltyUpdate);



module.exports = penaltyRouter;