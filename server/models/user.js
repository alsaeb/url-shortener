const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (v) => {
                    return /([A-Za-z0-9])\w+/.test(v);
                },
                message: (username) =>
                    `${username.value} is not a valid username`,
            },
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            validate: {
                validator: (email) => {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        email
                    );
                },
                message: (email) => `${email.value} is not a valid email`,
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
        },
        dateCreated: {
            type: Date,
            default: Date.now,
        },
        urls: [
            {
                type: Schema.Types.ObjectId,
                ref: "Slug",
            },
        ],
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
            },
        },
    }
);

userSchema.methods.generateJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return {
        ...user,
        token,
    };
};

userSchema.statics.findUser = async function (email, password) {
    const user = await User.findOne({ email });

    if (user.password === CryptoJS.SHA256(password).toString()) {
        return user;
    } else {
        throw new Error("Unable to login");
    }
};
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = CryptoJS.SHA256(user.password);
    }

    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
