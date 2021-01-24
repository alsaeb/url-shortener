const express = require("express");
const router = new express.Router();
const shortId = require("shortid");
const Slug = require("../models/slug");
const SlugServices = require("../services/slug.services");
const UserServices = require("../services/user.services");
const { response } = require("express");

router.post("/slug", async (req, res) => {
    const slug = req.body;
    try {
        // It returns either true or response message
        if (SlugServices.isValid(slug) === true) {
            let response;
            const user = await UserServices.findByToken(req.header("Authorization"));
            if (user) {
                response = await SlugServices.addToUser(slug, user.user);
            } else {
                response = await SlugServices.createSingle(slug);
            }
            if(response.code){
                res.status(response.code).send(response.message);
            }
            res.status(201).send(response);
        }else {
            res.status(SlugServices.isValid(slug).code).send(SlugServices.isValid(slug).message)
        }
    } catch (e) {
        res.status(401);
    }
});

router.get("/slug", async (req, res) => {
    try {
        const slug = await Slug.findSlug(req.body);
        res.redirect(slug.URL);
    } catch (e) {
        throw new Error(e);
    }
});

module.exports = router;
