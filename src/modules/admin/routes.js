
const adminRouter = require("express").Router(),
      multer = require("multer"),
      bcrypt = require("bcrypt"),
      isAdmin = require("../auth/middleware").checkRole("admin"),
      {addUser, deleteUser, displayUser} = require("./helpers"),
      config = require("../../../config/config.json"),
      path = require("path"),
      {User, Role} = require("../auth/models");

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(path.join(".."))
      cb(null, '../../../public/img/avatars/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
});

const avatarUpload = multer({storage: avatarStorage});
//admin router middleware.
//adminRouter.use(isAdmin); //check if admin

//MANAGER RESOURCE
adminRouter.get("/manager/add", (req, res) => {
    return res.render("admin/manager.new");
});

//post >> morakib/manager for submiting manager data.
adminRouter.post("/manager", avatarUpload.single("avatar"), addUser("manager"));

adminRouter.delete("/manager/:id", deleteUser());

adminRouter.get("/manager/:id", displayUser("manager"));

adminRouter.get("/manager/:id/edit", displayUser("manager", true));

adminRouter.put("/manager/:id", (req, res) => {

});


//MORAKIB RESOURCE
adminRouter.get("/inspector/add", (req, res) => {
    return res.render("admin/inspector.new");
});

adminRouter.post("/inspector", addUser("inspector"));

adminRouter.get("/inspector", (req, res) => {

});

adminRouter.delete("/inspector/:id", deleteUser());

adminRouter.get("/inspector/:id", displayUser("inspector"));

adminRouter.get("/inspector/:id/edit", displayUser("inspector", true));

adminRouter.put("/inspector/:id", (req, res) => {

});

module.exports.adminRouter = adminRouter;