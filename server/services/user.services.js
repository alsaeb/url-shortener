const User = require("../models/user");
const Slug = require("../models/slug");
const { authorizeToken } = require("../middleware/authorize");
const UserServices = (() => {
    return {
        isValid: (user) => {
            if (user) {
                const validUser = new User(user);
                const error = validUser.validateSync();
                if (!error) {
                    return true;
                }
            }
        },
        signUp: async (_user) => {
            const user = await new User(_user).save();
            const token = await user.generateJWT();
            return { user, token };
        },
        login: async (email, password) => {
            const user = await User.findUser(email, password);
            const token = await user.generateJWT();
            return { user, token };
        },
        logOut: async (user, token) => {
            user.tokens = user.tokens.filter((_token) => {
                return _token.token !== token;
            });
            await user.save();
        },
        findByToken: async (token) => {
            if (!token) return false;
            const user = await authorizeToken(token);
            let slugs = [];

            for (url in user.urls) {
                let slug = await Slug.findById(user.urls[url]);
                slugs.push(slug);
            }
            return { user, slugs };
        },
    };
})();

module.exports = UserServices;
