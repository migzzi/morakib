const express = require("express"),
      cors = require("cors"),
      bodyParser = require("body-parser"),
      morgan = require("morgan"),
      authRouter = require("./src/modules/auth/routes"),
      authMiddlewares = require("./src/modules/auth/middleware"),
      gawlaRouter = require('./src/modules/gawla/routes');
      path = require("path"),
      routers = require("./config/routers").routers,
      gawlaModels = require("./src/modules/gawla/models"),
      db = require("./src/database/connection");

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

//Object.entries(routers).map(router => app.use(router[0], router[1]));

//handle 404 not found routes.
app.use((req, res, next)=>{
    return res.status(404).json({error: true, msg: "Resource not found."});
})
//Handle 500 server errors.
app.use((err, req, res, next)=>{
    console.log(err);
    return res.status(500).json({error: true, msg: "Something went wrong!"});
});

app.listen(process.env.PORT || 8888, (err)=>{
    if(err) console.log("Error happended! Server can't run.");
    else console.log("Listening....");
})

//Testing if the connection is established.
db.authenticate()
    .then(()=> {
        console.log("Connection to the database has been established successfully.");
        return db.sync({force: true});
    })
    .catch((err)=> console.log("ERROR! Connection couldn't be established. Check you DB service or your configurations.", err));
