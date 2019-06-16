const express = require("express");
const penaltyRouter = express.Router();
const penaltyController = require("./penaltyController");

// get the penalty page
penaltyRouter.get("/add-penalty",penaltyController.getAddPenalty);

// get the types of the penaltyRouter
penaltyRouter.get("/add-penalty/:penaltyClass",penaltyController.getPenaltyType);

// get the term of the penaltyType
penaltyRouter.get("/add-penalty/penaltyType/:penaltyTerm",penaltyController.getPenaltyTerm)



module.exports = penaltyRouter;