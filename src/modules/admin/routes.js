
const adminRouter = require("express").Router(),
      multer = require("multer"),
      bcrypt = require("bcrypt"),
      isAdmin = require("../auth/middleware").checkRole("admin"),
      {addUserGet, addUserPost, deleteUser, displayUser, getUsers, updateUser} = require("./helpers"),
      config = require("../../../config/config.json"),
      path = require("path"),
      {User, Role} = require("../auth/models");

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(path.join(".."))
      cb(null, '/home/maged/Desktop/todo_api/public/img/avatars/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.split(".").slice(0, -1).join(".") + '-' + Date.now() + path.extname(file.originalname));
    }
});

const avatarUpload = multer({storage: avatarStorage});
//admin router middleware.
//adminRouter.use(isAdmin); //check if admin

//EMPLOYEE RESOURCE
adminRouter.get("/employees", getUsers());
adminRouter.get("/employee/add", addUserGet());
adminRouter.post("/employees", avatarUpload.single("avatar"), addUserPost());
adminRouter.get("/profile/:username", displayUser(null, false, "username"));
adminRouter.put("/employee/:id", avatarUpload.single("avatar"), updateUser());

//MANAGER RESOURCE
adminRouter.get("/managers", getUsers("manager"));
adminRouter.get("/manager/add", addUserGet());

//post >> morakib/manager for submiting manager data.
adminRouter.post("/managers", avatarUpload.single("avatar"), addUserPost());

adminRouter.delete("/manager/:id", deleteUser());

adminRouter.get("/manager/:id", displayUser("manager"));

adminRouter.get("/manager/:id/edit", displayUser("manager", true));

adminRouter.put("/manager/:id", (req, res) => {

});


//MORAKIB RESOURCE
adminRouter.get("/inspectors", getUsers("inspector"));
adminRouter.get("/inspector/add", addUserGet());
adminRouter.post("/inspectors", addUserPost());

adminRouter.get("/inspectors", (req, res) => {
    Role.findOne({where: {role:req.query.role }})
});

adminRouter.delete("/inspector/:id", deleteUser());

adminRouter.get("/inspector/:id", displayUser("inspector"));

adminRouter.get("/inspector/:id/edit", displayUser("inspector", true));

adminRouter.put("/inspector/:id", (req, res) => {

});

module.exports.adminRouter = adminRouter;