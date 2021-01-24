const User = require("../../server/models/user");
require("../../server/loaders/db");
const {
    validUser,
    UserWithInvalidEmail,
    UserWithInvalidUsername,
    deleteUserDatabase
} = require("../testData/unit.data");

afterEach(deleteUserDatabase);

test("Should Create and Save new User", async () => {
    const savedValidUser = await new User(validUser).save();
    expect(savedValidUser._id).toBeDefined();
    expect(savedValidUser.username).toBe(validUser.username);
    expect(savedValidUser.email).toBe(validUser.email);
    expect(savedValidUser.password).not.toBe(validUser.password);
    expect(savedValidUser.tokens[1]).toBe(validUser.tokens[1]);
});

test("Should return validation error on wrong email/username", async () => {
    await new User(UserWithInvalidEmail).save((err) => {
        if (err) {
            expect(err._message).toBe("User validation failed");
        }
    });
    await new User(UserWithInvalidUsername).save((err) => {
        if (err) {
            expect(err._message).toBe("User validation failed");
        }
    });
});

test("Should generate token for User by their ObjectId", async () => {
    const userWithoutToken = new User(validUser);
    const userWithToken = await userWithoutToken.generateJWT();
    expect(userWithToken._doc.tokens[1]).toBeDefined();
});
