const jwt = require("jsonwebtoken"),
      secret = process.env.APP_TOKEN_SECRET || require("../../../config/config.json")[process.env.APP_ENV || "development"].token_secret,
      { User } = require("./models");

function loginRequired(api=false, redirect_url="/login"){
    return (req, res, next) => {
        if(req.user || req.decodedToken) return next();
        if(api) return res.json({error: true, msg: "loggin is required", next: req.url});
        return res.redirect(redirect_url + "?next=" + req.url);
    };
}

function authenticateTokenFor(target, api=false, respons_page="auth/not_authorized"){
    return function (req, res, next){
        let token = req.headers["x-access-token"] || req.headers["authorization"] || (req.cookies && req.cookies["auth_token"]) || (req.headers["cookie"] && req.headers["cookie"].split("; ").reduce((cookies, cookie, i) => {
            let c = cookie.split("=");
            return Object.assign(cookies, {[c[0]]: c[1]});
        }, {})["auth_token"]);
        //console.log("====", token);
        if(!token) {
            return next();
        }
        if(token.startsWith("Bearer "))
            token = token.slice(7);
            
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) {
                console.log(err);
                return next(); //res.status(400).json({error: true, code: 0, msg: "Token not valid."});
            }
            target.findOne({where: {username: decodedToken.username}})
            .then(user => {
                if(!user){
                    if(api) return res.json({
                        error: true,
                        code: 0,
                        msg: "Invalid username."
                    });
                    return res.render(respons_page);
                }
                req.user = res.locals.user = user;
                req.authenticated = res.locals.authenticated = true;
                req.decodedToken = res.locals.decodedToken = decodedToken;
                return next();
                });
            });
    }
}

let authenticateToken = authenticateTokenFor(User);

function checkRole(roles, api=false, reponse_page="auth/not_authorized"){
    //check the role if matched the given one it passes to the next middleware or return not authorized.
    //i.e. checkRole("admin")
    return function(req, res, next){
        if(!req.authenticated) {
            if(api) return res.json({
                error: true,
                code: 0,
                msg: "login is required"
            });
            return res.render(reponse_page);
        }
        if(roles.constructor.name == "Array" && roles.indexOf(req.decodedToken.role.role) != -1){
            next();
        } else if(roles.constructor.name == "String" && req.decodedToken.role.role === roles){
            next();
        } else if(roles == null){
            next();
        } else {
            if(api) return res.json({
                error: true,
                code: 1,
                msg: "no authorized (must be " + roles + ")"
            });
            return res.render(reponse_page);
        }
    }
}

const forceJSON = (req, res, next)=>{
    console.log(req.headers);
    if(req.headers["content-type"] !== "application/json")
        return res.status(400).send("Server support json only.");
    next();
}

function isOwner(api=false, let_admin=true, param="id", error_page="auth/not_authorized"){
    return (req, res, next) => {
        if(req.user[param] == req.params[param] || (let_admin && req.decodedToken.role.role == "admin")) return next();
        if(api) return res.json({error: true, msg: "not owner of the resource"});
        return res.render(error_page);
    };
}

module.exports = {
    authenticateTokenFor,
    authenticateToken,
    checkRole,
    loginRequired,
    isOwner
};