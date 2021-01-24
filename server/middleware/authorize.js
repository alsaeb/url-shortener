const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authorize = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error("Cant authorize");
        }

        next();
    } catch (e) {
        res.send(401);
    }
};

const authorizeToken = async (token) => {
    if (token === undefined) {
        return false;
    }

    try {
        const _token = token.replace("Bearer ", "");
        const decoded = jwt.verify(_token, process.env.JWT_KEY);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": _token,
        });

        if (!user) {
            return false;
        }
        
        // Returns User to know which user is being authorized (see slug route)
        return user;
    } catch (e) {
        return e;
    }
};

module.exports = {
    authorize,
    authorizeToken,
};
