const express = require("express"),
      cors = require("cors"),
      bodyParser = require("body-parser"),
      morgan = require("morgan"),
      db = require("./src/database/connection"),
      authRouter = require("./src/modules/auth/routes"),
      authMiddlewares = require("./src/modules/auth/middleware"),
      path = require("path");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

//Third-party middlewares.
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("short"));

//custom middlewares.
const forceJSON = (req, res, next)=>{
    console.log(req.headers);
    if(req.headers["content-type"] !== "application/json")
        return res.status(400).send("Server support json only.");
    next();
}
//register routers.
//commit



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
