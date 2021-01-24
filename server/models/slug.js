const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slugSchema = new Schema({
    URL: {
        type: String,
        required: true,
        validate: {
            validator: (url) => {
                return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(
                    url
                );
            },
            message: (u) => `${u.value} is not a valid URL`,
        },
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20,
        validate: {
            validator: (slug) => {
                return /([A-Za-z0-9])\w+/.test(slug);
            },
            message: (slug) => `${slug.value} is not valid slug`,
        },
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

slugSchema.statics.findSlug = async function (slug_value) {
    const slug = await Slug.findOne(slug_value);
    return slug;
};

const Slug = mongoose.model("Slug", slugSchema);
module.exports = Slug;
