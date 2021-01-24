const User = require("../models/user");
const Slug = require("../models/slug");
const shortId = require("shortid");
const SlugServices = (() => {
    return {
        isValid: (slug) => {
            if (slug.URL === process.env.URL) {
                return {
                    code: 400,
                    message: "You can not create a slug with host URL",
                };
            }
            return true;
        },
        createSingle: async (_slug) => {
            const slug = new Slug(_slug);
            if (!slug.slug) {
                slug.slug = shortId.generate();
            } else {
                return {
                    code: 400,
                    message: "You need to be logged in to create a named slug",
                };
            }
            await slug.save();
            return { slug };
        },
        addToUser: async (_slug, _user) => {
            const user = await User.findById(_user._id);
            const slug = new Slug(_slug);
            let slugs = [];

            for (slug in user.slugs) {
                slugs.push(slug._id);
            }
            slugs.push(slug._id);

            user.urls = slugs;
            if (!slug.slug) {
                slug.slug = shortId.generate();
            }
            await user.save();
            await slug.save();
            return { user, slug };
        },
    };
})();

module.exports = SlugServices;
