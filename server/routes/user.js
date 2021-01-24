const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const { authorize } = require("../middleware/authorize");
const UserServices = require("../services/user.services");

router.post("/user", async (req, res) => {
    const user = req.body;
    if (await UserServices.isValid(user)) {
        try {
            const response = await UserServices.signUp(user);
            res.status(201).send(response);
        } catch (e) {
            res.status(404);
            throw new Error(e);
        }
    }
});

router.post("/user/login", async (req, res) => {
    const userInfo = req.body;
    try {
        const response = await UserServices.login(
            userInfo.email,
            userInfo.password
        );
        res.send(response);
    } catch (e) {
        res.send(404);
    }
});

router.post("/user/logout", authorize, async (req, res) => {
    const user = req.user;
    const token = req.token;
    try {
        UserServices.logOut(user, token);
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/user/me", authorize, async (req, res) => {
    const token = req.headers.authorization;
    const user = await UserServices.findByToken(token);
    try {
        res.status(200).send(user);
    } catch (e) {
        res.status(400);
    }
});

module.exports = router;
