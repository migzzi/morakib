
const { User } = require("../TodoList/models"),
      authRouter = require("express").Router(),
      bcrypt = require("bcrypt"),
      config = require("../../../config/config.json")[process.env.APP_ENV || "development"],
      jwt = require("jsonwebtoken");

const tokenSecret = process.env.APP_TOKEN_SECRET || config.token_secret;
const saltRoundsCount = process.env.APP_SALT_ROUNDS_COUNT || config.salt_rounds_count;

authRouter.post("/register", (req, res) => {
  let username = req.body.username;
  bcrypt.hash(req.body.password, saltRoundsCount)
  .then(hashedPassword => {
    return User.create({username, password: hashedPassword});
  })
  .then(() => {
    let token = jwt.sign({username: username}, tokenSecret, {expiresIn: 3000});
    return res.json({
      success: true,
      msg: "Autheticated successfully!",
      token: token
    });
  })
  .catch((err)=>{
    console.log(err);
    return res.json({
      error: true,
      msg: "Authentication faild!"
    });
  });

});

authRouter.post("/login", (req, res) => {
  let username = req.body.username;
  User.findOne({where: {username: username}})
  .then(user => {
    if(!user) 
      return res.json({error: true, msg: "incorrect username or password"});
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(valid => {
    if(!valid) 
      return res.json({error: true, msg: "incorrect username or password"});
    let token = jwt.sign({username: username}, tokenSecret, {expiresIn: 3000});
    return res.json({
      success: true,
      msg: "Autheticated successfully!",
      token: token
    });
  })
  .catch((err)=>{
    console.log(err);
    return res.json({
      error: true,
      msg: "Authentication faild!"
    });
  });
});

module.exports = authRouter;