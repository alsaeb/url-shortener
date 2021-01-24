const request = require("supertest");
const app = require("../../server/app");
const Slug = require("../../server/models/slug");
const User = require("../../server/models/user");
const {
    slugWithHostURL,
    validSlug,
    slugWithEmptyValue,
    loadDatabase,
    slugForUser,
    userToAddURL,
    userToAddURLId,
} = require("../testData/integration.data");

beforeEach(loadDatabase);

test("Should create a slug with random value when user doesnt specified one ", async () => {
    const response = await request(app)
        .post("/slug")
        .send({
            URL: slugWithEmptyValue.URL,
            slug: slugWithEmptyValue.slug,
        })
        .expect(201);

    // Check if slug is added to the database
    const slug = await Slug.findById(response.body.slug._id);
    expect(slug).not.toBeNull();

    // Check if response is correct
    expect(response.body.slug.URL).toBe(slugWithEmptyValue.URL);
    expect(response.body.slug.slug).not.toBeNull();
});

test("Should not create named slug without authorization ", async () => {
    await request(app)
        .post("/slug")
        .send({
            URL: validSlug.URL,
            slug: validSlug.slug,
        })
        .expect(400);
});

test("Should not create a slug with host URL ", async (done) => {
    await request(app)
        .post("/slug")
        .send({
            URL: slugWithHostURL.URL,
            slug: "Vesko"
        })
        .expect(400);
    done();
});

//Should i use HTTP CONNECT?
test("Should redirect to URL by slug", async () => {
    await request(app)
        .get("/slug")
        .send(validSlug.slug)
        .expect(302);
});

test("Save a slug to User by Authorization token", async () => {
    const response = await request(app)
        .post("/slug")
        .set("Authorization", `Bearer ${userToAddURL.tokens[0].token}`)
        .send({
            URL: slugForUser.URL,
            slug: slugForUser.slug,
        })
        .expect(201);

    const user = await User.findById(userToAddURLId);
    expect(response.body.slug._id).toBe(user.urls[0].toString());
});
