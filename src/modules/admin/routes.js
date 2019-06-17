
const adminRouter = require("express").Router(),
      isAdmin = require("../auth/middleware").checkRole("admin"),
      {addUserGet, addUserPost, deleteUser, displayUser, getUsers, updateUser, listEmployees, getPenalty, updatePenalty, deletePenalty, addPenalty} = require("./helpers"),
      config = require("../../../config/config.json"),
      path = require("path"),
      middlewares = require("./middlewares"),
      {User, Role} = require("../auth/models");

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

//admin router middleware.
//adminRouter.use(isAdmin); //check if admin

//EMPLOYEE RESOURCE
adminRouter.get("/employees", getUsers());
adminRouter.get("/employees/list", listEmployees()); //html response
adminRouter.get("/employee/add", addUserGet());
adminRouter.post("/employees", middlewares.avatarUpload.single("avatar"), addUserPost());
adminRouter.get("/employee/:username", displayUser(null, false, "username"));
adminRouter.get("/employee/:username/edit", displayUser(null, true, "username"));
adminRouter.delete("/employee/:id", deleteUser());
adminRouter.put("/employee/:id", middlewares.avatarUpload.single("avatar"), updateUser());

//MANAGER RESOURCE
adminRouter.get("/managers", getUsers("manager")); //api json response
adminRouter.get("/managers/list", listEmployees("managers")); //html response
adminRouter.get("/manager/add", addUserGet()); //html response
adminRouter.post("/managers", middlewares.avatarUpload.single("avatar"), addUserPost()); //api json response
adminRouter.delete("/manager/:id", deleteUser()); //api json response
adminRouter.get("/manager/:id", displayUser("manager")); //html response
adminRouter.get("/manager/:id/edit", displayUser("manager", true));  //html response
adminRouter.put("/manager/:id", middlewares.avatarUpload.single("avatar"), updateUser()); //api json response


//INSPECTOR RESOURCE
adminRouter.get("/inspectors", getUsers("inspector"));
adminRouter.get("/inspectors/list", listEmployees("inspectors"));
adminRouter.get("/inspector/add", addUserGet());
adminRouter.post("/inspectors", middlewares.avatarUpload.single("avatar"), addUserPost());
adminRouter.delete("/inspector/:id", deleteUser());
adminRouter.get("/inspector/:id", displayUser("inspector"));
adminRouter.get("/inspector/:id/edit", displayUser("inspector", true));
adminRouter.put("/inspector/:id", middlewares.avatarUpload.single("avatar"), updateUser());

//PENALTIES RESOURCE
adminRouter.get("/pen_classes", getPenalty("class", true));
adminRouter.get("/pen_classes/list", getPenalty("class", false, "admin/list_pen_classes"));
adminRouter.post("/pen_classes", addPenalty("class", true));
adminRouter.delete("/pen_class/:id", deletePenalty("class", true));
adminRouter.put("pen_class/:id", updatePenalty("class", true));

adminRouter.get("/pen_types/", getPenalty("type", true));
adminRouter.get("/pen_types/list", getPenalty("type", false, "admin/list_pen_types"));
adminRouter.post("/pen_types", addPenalty("type", true));
adminRouter.delete("/pen_type/:id", deletePenalty("type", true));
adminRouter.put("/pen_type/:id", updatePenalty("type", true));

adminRouter.get("/pen_terms/", getPenalty("term", true));
adminRouter.get("/pen_terms/list", getPenalty("term", false, "admin/list_pen_terms"));
adminRouter.post("/pen_terms", addPenalty("term", true));
adminRouter.delete("/pen_term/:id", deletePenalty("term", true));
adminRouter.put("/pen_term/:id", updatePenalty("term", true));

adminRouter.get("/pen_class/:pen_class_id/pen_types", getPenalty("type", true));
adminRouter.get("/pen_type/:pen_type_id/pen_terms", getPenalty("term", true));
adminRouter.get("/pen_class/:pen_class_id/pen_type/:id", getPenalty("type", true));
adminRouter.get("/pen_type/:pen_type_id/pen_term/:id", getPenalty("term", true));
module.exports.adminRouter = adminRouter;