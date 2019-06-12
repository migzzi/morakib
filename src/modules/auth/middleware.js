
const jwt = require("jsonwebtoken"),
      secret = process.env.APP_TOKEN_SECRET || require("../../../config/config.json")[process.env.APP_ENV || "development"].token_secret,
      { User } = require("./models");


function authenticateTokenFor(target){

    return function (req, res, next){
        let token = req.headers["x-access-token"] || req.headers["authorization"];
        if(!token)
            return res.status(400).json({
                error: true,
                code: 0,
                msg: "Access token is not supplied."
            });
    
        if(token.startsWith("Bearer "))
            token = token.slice(7);
            
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) return res.status(400).json({error: true, code: 0, msg: "Token not valid."});
            req.decodedToken = decodedToken;
            target.findOne({where: {username: decodedToken.username}})
            .then(user => {
                if(!user)
                    return res.json({
                        error: true,
                        code: 0,
                        msg: "Invalid username."
                    });
                req.user = res.locals.user = user;
                req.decodedToken = res.locals.decodedToken = decodedToken;
                next();
                });
            });
    }
}
let authenticateToken = authenticateTokenFor(User);

function checkRole(role){
    //check the role if matched the given one it passes to the next middleware or return not authorized.
    //i.e. checkRole("admin")
    return function(req, res, next){
        if(req.token.role === role){
            next();
        } else return res.json({
            error: true,
            code: 0,
            msg: "no authorized (must be " + role + ")"
        });
    }
}

module.exports = {
    authenticateTokenFor,
    authenticateToken,
    checkRole
};