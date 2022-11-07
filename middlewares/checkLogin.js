const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {username, userId} = decoded; //got from jwt.sign
        req.username = username; //injecting username to req object
        req.userId = userId; //injecting userid to req object
        next();
    } catch (error) {
        next('Authentication Failure!')
    }
}

module.exports = checkLogin;