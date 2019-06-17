
const { User, Role } = require("./models"),
      authRouter = require("express").Router(),
      bcrypt = require("bcrypt"),
      config = require("../../../config/config.json")[process.env.APP_ENV || "development"],
      jwt = require("jsonwebtoken");

const {postLogin} = require("./helpers");

authRouter.get("/login", (req, res) => {
  if(req.decodedToken || req.user) return res.redirect("/home");
  return res.render("auth/login");
});
authRouter.post("/auth/login", postLogin(true));
module.exports.authRouter = authRouter;

