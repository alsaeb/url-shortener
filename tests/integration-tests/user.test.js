const request = require("supertest");
const app = require("../../server/app");
const User = require("../../server/models/user");
const {
    validUserWithURL,
    validUser,
    nonExistentUser,
    loadDatabase,
} = require("../testData/integration.data");

afterEach(loadDatabase);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/user")
        .send({
            username: validUser.username,
            email: validUser.email,
            password: validUser.password,
        })
        .expect(201);
        
    // Check if user has been added to database
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Check if the response is correct
    expect(response.body).toMatchObject({
        user: {
            username: validUser.username,
            email: validUser.email,
        },
    });
    // Check if the password is not in plaintext
    expect(user.password).not.toBe(validUser.password);
});

test("Should login existing user", async () => {
    const response = await request(app)
        .post("/user/login")
        .send({
            email: validUserWithURL.email,
            password: validUserWithURL.password,
        })
        .expect(200);

    // Check if user is authenticated
    const user = await User.findById(validUserWithURL._id);
    expect(response.body.token.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
    await request(app)
        .post("/user/login")
        .send({
            email: nonExistentUser.email,
            password: nonExistentUser.password,
        })
        .expect(404);
});

test("Should get profile for user", async (done) => {
    await request(app)
        .get("/user/me")
        .set("Authorization", `Bearer ${validUserWithURL.tokens[0].token}`)
        .send()
        .expect(200);
    done();
});

// For some reason only this test and ../slug.test.js POST require callback() ?
test("Should not get profile for unauthenticated user", async (done) => {
    await request(app).get("/user/me").send().expect(401);
    done();
});
