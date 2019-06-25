const express = require("express"),
      cors = require("cors"),
      bodyParser = require("body-parser"),
      morgan = require("morgan"),
      authRouter = require("./src/modules/auth/routes").authRouter,
      authMiddlewares = require("./src/modules/auth/middleware"),
      gawlaRouter = require('./src/modules/gawla/managerRouter'),
      path = require("path"),
      gawlaModels = require("./src/modules/gawla/models"),
      db = require("./src/database/connection"),
      adminRouter = require("./src/modules/admin/routes").adminRouter,
      inspectorRouter = require('./src/modules/gawla/inspectorRoute'),
      penaltyRouter = require("./src/modules/penalty/penaltyRoutes"),
      homeController = require('./src/modules/gawla/controllers').getHome;

const {User, Role} = require("./src/modules/auth/models");
const {Gawla, Penalty, PenaltyClass, PenaltyType, PenaltyTerm} = require("./src/modules/gawla/models");
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
//Third-party middlewares.
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("short"));



//authentication middleware assign logged in user to the request.
app.use(authMiddlewares.authenticateToken);
app.use(authRouter);
//register routers.

app.use(authMiddlewares.loginRequired());
//commit
app.get("/",homeController);

const {displayUser, updateUser, getUsers, deleteUser} = require("./src/modules/admin/helpers");

app.use(gawlaRouter);
app.use(inspectorRouter);
app.use('/penalty',penaltyRouter);
app.get("/profile/:username", displayUser(null, false, "username"));
app.get("/profile/:username/edit", authMiddlewares.isOwner(false, true, "username"), displayUser(null, true, "username"));
app.put("/profile/:username", authMiddlewares.isOwner(false, true, "username"), updateUser(true, null, "username"));
app.use("/admin", authMiddlewares.checkRole("admin"), adminRouter);

//some APIs endpoints
app.get("/managers", getUsers("manager")); //api json response
app.get("/manager/:manager_id/employees", getUsers()); //api json response
app.get("/manager/:manager_id/inspectors", getUsers("inspector")); //api json response
app.get("/inspectors", getUsers("inspector")); //api json response
app.get("/employees", getUsers()); //api json response
//===================

//Object.entries(routers).map(router => app.use(router[0], router[1]));

//handle 404 not found routes.
// app.use("/penalty",penaltyRouter);
app.use((req, res, next) => {
    return res.status(404).json({error: true, msg: "Resource not found."});
})
//Handle 500 server errors.
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({error: true, msg: "Something went wrong!"});
});

app.listen(process.env.PORT || 8888, (err) => {
    if(err) console.log("Error happended! Server can't run.");
    else console.log("Listening....");
})

//Testing if the connection is established.

config = require("./config/config.json")[process.env.APP_ENV || "development"];

const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;
let bcrypt = require("bcrypt");
function createSuperUser(obj){
    let username = obj.username;
    return bcrypt.hash(obj.password, saltRoundsCount)
    .then(hashedPassword => {
        return User.create(Object.assign(obj, {password: hashedPassword}));
    })
     
}


db.authenticate()
    .then(()=> {
        console.log("Connection to the database has been established successfully.");
        // return db.sync({force: true});
    })
    // .then(() => {
    //     return Role.bulkCreate([
    //         {role: "admin", desc: "the big boss"},
    //         {role: "manager", desc: "the big boss"},
    //         {role: "inspector", desc: "the big boss"},
    //     ]);
    // })
    // .then(() => {
    //     createSuperUser({
    //         username: "maged",
    //         first_name: "ماجد",
    //         last_name: "مجدى",
    //         password: "123456",
    //         email: "maged@gmail.com",
    //         roleId: 1,
    //         avatar: "default.png"
    //     }).then(() => {
    //         return createSuperUser({first_name: "عمرو", last_name: "والى", username: "amr", password: "0000", email: "magedmagdy105@gmail.com", avatar: "default.png", roleId: 2})
    //     }).then(() => {
    //         return createSuperUser({first_name: "احمد", last_name: "وفيق", username: "wafik", password: "0000", email: "ahmed@gmail.com", avatar: "default.png", roleId: 3, managerId: 2})
    //     }).then(() => {
    //         return createSuperUser({first_name: "احمد", last_name: "نجيب", username: "nagiub", password: "0000", email: "marwa@gmail.com", avatar: "default.png", roleId: 3, managerId: 2})
    //     })
       
    // })
    // .then(() => {
    //     PenaltyClass.bulkCreate([
    //         {name: "صحية"}, {name: "بناء"}, {name: "مرافق"}, {name: "تعامﻻت"}, {name: "مالية"}
    //     ]).then((pen_classes) => {
    //         return PenaltyType.bulkCreate([
    //             {name: "نظافة", pen_class_id: 1}, {name: "اهمال", pen_class_id: 1},
    //             {name: "تصريح", pen_class_id: 2}, {name: "طريق", pen_class_id: 2}, {name: "ضوضاء", pen_class_id: 2},
    //             {name: "تصريح", pen_class_id: 3}, {name: "طريق", pen_class_id: 3}, {name: "ازعاج", pen_class_id: 3},
    //             {name: "شكوى", pen_class_id: 4},
    //             {name: "اختﻻس", pen_class_id: 5}, {name: "ضرائب", pen_class_id: 5}, {name: "فواتير", pen_class_id: 5}
    //         ]).then((types) => {
    //             return PenaltyTerm.bulkCreate([
    //                 {name: "القاء قمامة", pen_type_id: 1, addons: "ازالة القمامة فورياً", value: 2000}, 
    //                 {name: "معدات غير نظيفة", pen_type_id: 1, value: 3000},
    //                 {name: "اهمال مرضى", pen_type_id: 2, value: 5000},
    //                 {name: "بدون تصريح", pen_type_id: 3, addons: "اغﻻق فورى للمنشأة", value: 20000},
    //                 {name: "تصريح منتهى", pen_type_id: 3, addons: "اغﻻق فورى للمنشأة", value: 15000},
    //                 {name: "تصريح مزور", pen_type_id: 3, addons: "اغﻻق فورى للمنشأة", value: 30000},
    //                 {name: "تخريب طريق", pen_type_id: 4, value: 10000},
    //                 {name: "تعطيل طريق", pen_type_id: 4, value: 5000},
    //                 {name: "ازعاج مارة", pen_type_id: 5, value: 1000},
    //                 {name: "شكوى زبائن", pen_type_id: 5, value: 2500},
    //                 {name: "غسيل اموال", pen_type_id: 6, value: 20000},
    //                 {name: "تهرب ضريبى", pen_type_id: 7, value: 50000},
    //                 {name: "عدم سداد فواتير", pen_type_id: 8, value: 5000},
    //             ])
    //         })
    //     }).catch(err => console.log(err))
    // })
    .catch((err)=> console.log("ERROR! Connection couldn't be established. Check you DB service or your configurations.", err));


