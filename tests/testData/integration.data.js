const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../server/models/user");
const Slug = require("../../server/models/slug");

const slugWithHostURLId = new mongoose.Types.ObjectId();
const slugWithHostURL = {
    _id: slugWithHostURLId,
    URL: process.env.URL,
    slug: "hsorew3",
};

// It is saved in database in loadDatabase() because it is used in GET test
const validSlugId = new mongoose.Types.ObjectId();
const validSlug = {
    _id: validSlugId,
    URL: "https://www.chess.com/home",
    slug: "chess",
};

const slugWithEmptyValueId = new mongoose.Types.ObjectId();
const slugWithEmptyValue = {
    _id: slugWithEmptyValueId,
    URL: "http://www.three.co.uk/",
    slug: "",
};

const slugForUserId = new mongoose.Types.ObjectId();
const slugForUser = {
    _id: slugForUserId,
    URL: "https://www.facebook.com/",
    slug: "fcbk",
};

const validUserWithURLId = new mongoose.Types.ObjectId();
const validUserWithURL = {
    _id: validUserWithURLId,
    username: "JamesCharles",
    email: "charles_j@something.com",
    password: "#PasW#ord",
    urls: [validSlugId],
    tokens: [
        {
            token: jwt.sign({ _id: validUserWithURLId }, process.env.JWT_KEY),
        },
    ],
};

const validUserId = new mongoose.Types.ObjectId();
const validUser = {
    _id: validUserId,
    username: "IvoryGreen",
    email: "green@something.com",
    password: "$OJVDA",
    tokens: [
        {
            token: jwt.sign({ _id: validUserId }, process.env.JWT_KEY),
        },
    ],
};

const userToAddURLId = new mongoose.Types.ObjectId();
const userToAddURL = {
    _id: userToAddURLId,
    username: "ConstVikov",
    email: "vikov@sst.com",
    password: "HF#V)a",
    tokens: [
        {
            token: jwt.sign({ _id: userToAddURLId }, process.env.JWT_KEY),
        },
    ],
};

const nonExistentUserId = new mongoose.Types.ObjectId();
const nonExistentUser = {
    _id: nonExistentUserId,
    username: "ConGrat",
    email: "bay@sg.com",
    password: "$vadf@a",
    tokens: [
        {
            token: jwt.sign({ _id: nonExistentUserId }, process.env.JWT_KEY),
        },
    ],
};
const dumpDatabase = async () => {
    await User.deleteMany();
    await Slug.deleteMany();
};

const loadDatabase = async () => {
    await dumpDatabase();
    await new User(validUserWithURL).save();
    await new Slug(validSlug).save();
    await new User(userToAddURL).save();
};

module.exports = {
    validUserWithURLId,
    validUserWithURL,
    validUserId,
    validUser,
    nonExistentUserId,
    nonExistentUser,
    slugWithHostURLId,
    slugWithHostURL,
    validSlugId,
    validSlug,
    slugForUserId,
    slugForUser,
    userToAddURLId,
    userToAddURL,
    slugWithEmptyValueId,
    slugWithEmptyValue,
    loadDatabase,
    dumpDatabase,
};
