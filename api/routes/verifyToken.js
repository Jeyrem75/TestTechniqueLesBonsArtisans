const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if(err) res.status(403).json("Le Token est invalide");
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json("Vous n'êtes pas connecté");
    }
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("Vous n'êtes pas autorisé à faire ça");
        }
    })
};

module.exports = { verifyToken, verifyTokenAndAdmin };