const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Slug = require("../../server/models/slug");
const User = require("../../server/models/user");

const validUserId = new mongoose.Types.ObjectId();
const validUser = {
    _id: validUserId,
    username: "FunShoy",
    email: "fs@g.com",
    password: "$ASD#@",
    tokens: [
        {
            token: jwt.sign({ _id: validUserId }, process.env.JWT_KEY),
        },
    ],
};

const userWithInvalidEmailId = new mongoose.Types.ObjectId();
const userWithInvalidEmail = {
    _id: userWithInvalidEmailId,
    username: "FunSoy",
    email: "fg",
    password: "$ASD#@",
    tokens: [
        {
            token: jwt.sign(
                { _id: userWithInvalidEmailId },
                process.env.JWT_KEY
            ),
        },
    ],
};

const userWithInvalidUsernameId = new mongoose.Types.ObjectId();
const userWithInvalidUsername = {
    _id: userWithInvalidUsernameId,
    username: "@_unSoy",
    email: "fg@gmail.com",
    password: "$ASD#@",
    tokens: [
        {
            token: jwt.sign(
                { _id: userWithInvalidUsernameId },
                process.env.JWT_KEY
            ),
        },
    ],
};

const validSlugId = new mongoose.Types.ObjectId();
const validSlug = {
    _id: validSlugId,
    URL: "https://jestjs.io/docs/en/asynchronous",
    slug: "hsorew3",
};

const slugWithInvalidURLId = new mongoose.Types.ObjectId();
const slugWithInvalidURL = {
    _id: slugWithInvalidURLId,
    URL: ".com.com",
    slug: "hsorew3",
};

const slugWithInvalidSlugId = new mongoose.Types.ObjectId();
const slugWithInvalidSlug = {
    _id: slugWithInvalidSlugId,
    URL: "https://jestjs.io/",
    slug: "@_hsorew3",
};

const deleteUserDatabase = async () => {
    await User.deleteMany();
};
const deleteSlugDatabase = async () => {
    await Slug.deleteMany();
};

module.exports = {
    validUser,
    validUserId,
    userWithInvalidEmailId,
    userWithInvalidEmail,
    userWithInvalidUsernameId,
    userWithInvalidUsername,
    validSlugId,
    validSlug,
    slugWithInvalidURLId,
    slugWithInvalidURL,
    slugWithInvalidSlugId,
    slugWithInvalidSlug,
    deleteUserDatabase,
    deleteSlugDatabase
};
