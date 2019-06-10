
const adminRouter = require("express").Router(),
      isAdmin = require("../auth/middleware").checkRole("admin");


//admin router middleware.
//adminRouter.use(isAdmin); //check if admin

adminRouter.get("/manager/add", (req, res) => {
    //res.render()
})

module.exports.adminRouter = adminRouter;