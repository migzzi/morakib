
const jwt = require("jsonwebtoken"),
      secret = process.env.APP_TOKEN_SECRET || require("../../../config/config.json")[process.env.APP_ENV || "development"].token_secret,
      { User } = require("../TodoList/models");

function authenticateToken(req, res, next){
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
        User.findOne({where: {username: decodedToken.username}})
        .then(user => {
            if(!user)
                return res.json({
                    error: true,
                    code: 0,
                    msg: "Invalid username."
                });
            req.user = user;
            next();
            });
        });
}

module.exports = {
    authenticateToken
};