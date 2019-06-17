const express = require("express"),
      cors = require("cors"),
      bodyParser = require("body-parser"),
      morgan = require("morgan"),
      authRouter = require("./src/modules/auth/routes"),
      authMiddlewares = require("./src/modules/auth/middleware"),
      gawlaRouter = require('./src/modules/gawla/routes');
      path = require("path"),
      gawlaModels = require("./src/modules/gawla/models"),
      db = require("./src/database/connection"),
      adminRouter = require("./src/modules/admin/routes").adminRouter,
      penaltyRouter = require("./src/modules/penalty/penaltyRoutes");

const {User, Role} = require("./src/modules/auth/models");
const Penalty_class = require ('./src/modules/gawla/models').PenaltyClass;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
//Third-party middlewares.
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("short"));


app.use(gawlaRouter);

//custom middlewares.
const forceJSON = (req, res, next)=>{
    console.log(req.headers);
    if(req.headers["content-type"] !== "application/json")
        return res.status(400).send("Server support json only.");
    next();
}
//register routers.
//commit
// 

//handle 404 not found routes.
app.use("/penalty",penaltyRouter);
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
    //     return Penalty_class.bulkCreate([
    //         {name: 'صحية' , descrition: 'لجولات الخاصة بالصحية'},
    //         {name: 'بناء' , descrition: 'لجولات الخاصةبالبناء'}

    //     ])
    // })
    // .then(() => {
    //     return User.bulkCreate([
    //         {first_name: "احمد",last_name:"وفيق",username:'وفيق',email: 'eng@gmail.com',manager_id:'',role_id:2},
    //         {first_name: "احمد",last_name:"وفيق",username:'نجيب',email: 'eng3@gmail.com',manager_id:1,role_id:3},
    //         {first_name: "محمد",last_name:"وفيق",username:'ماجد',email: 'eng56@gmail.com',manager_id: 1,role_id:3}



    //     ])
    // })
    .catch((err)=> console.log("ERROR! Connection couldn't be established. Check you DB service or your configurations.", err));
