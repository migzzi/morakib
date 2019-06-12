
const adminRouter = require("express").Router(),
      isAdmin = require("../auth/middleware").checkRole("admin");


//admin router middleware.
adminRouter.use(isAdmin); //check if admin

//MANAGER RESOURCE
adminRouter.get("/manager/add", (req, res) => {
    return res.render("/manager/add");
});

adminRouter.post("/manager", (req, res) => {

});

adminRouter.get("/manager", (req, res) => {

});

adminRouter.delete("/manager/:id", (req, res) => {

});

adminRouter.get("/manager/:id", (req, res) => {

});

adminRouter.get("/manager/:id/edit", (req, res) => {

});

adminRouter.put("/manager/:id", (req, res) => {

});


//MORAKIB RESOURCE
adminRouter.get("/morakib/add", (req, res) => {
    //res.render()
});

adminRouter.post("/morakib", (req, res) => {

});

adminRouter.get("/morakib", (req, res) => {
    
});

adminRouter.delete("/morakib/:id", (req, res) => {

});

adminRouter.get("/morakib/:id", (req, res) => {

});

adminRouter.get("/morakib/:id/edit", (req, res) => {

});

adminRouter.put("/morakib/:id", (req, res) => {

});

module.exports.adminRouter = adminRouter;