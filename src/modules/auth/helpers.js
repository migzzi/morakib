const { User, Role } = require("./models"),
      authRouter = require("express").Router(),
      bcrypt = require("bcrypt"),
      config = require("../../../config/config.json")[process.env.APP_ENV || "development"],
      jwt = require("jsonwebtoken");

const tokenSecret = process.env.APP_TOKEN_SECRET || config.token_secret;

function postLogin(api=false, login_page="auth/login", error_page="error"){
    return (req, res) => {
      if(req.user || req.decodedToken){
        if(api) return res.json({
          success: true,
          redirect: true,
          msg: "user already authenticated"
        });
        return res.render(login_page);
      }
      let username = req.body.username;
      User.findOne({where: {username: username}, include: [{model: Role, as: "role"}]})
      .then(user => {
        if(!user) {
          if(api) return res.json({error: true, msg: "incorrect username or password"});
          return res.render(error_page);
        }
        return bcrypt.compare(req.body.password, user.password, (err, same) => {
          if(err) {
            if(api) return res.json({error: true, msg: "Something went wrong"});
            return res.render(error_page);
          }
          if(!same) {
            if(api) return res.json({error: true, msg: "incorrect username or password"});
            return res.render(error_page);
          }
          let token = jwt.sign({username: username, role: user.role}, tokenSecret, {expiresIn: 3000});
          if(api) return res.json({
            success: true,
            msg: "Autheticated successfully!",
            token: token
          });
          return res.redirect(req.query.next);
        });
      })
      .catch((err)=>{
        console.log(err);
        if(api) return res.json({
          error: true,
          msg: "Authentication faild!"
        });
        return res.render(error_page);
      });
    };
  }
  module.exports.postLogin = postLogin;