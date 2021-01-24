const Slug = require("../../server/models/Slug");
require("../../server/loaders/db");
const {
    validSlug,
    slugWithInvalidURL,
    slugWithInvalidSlug,
    deleteSlugDatabase,
} = require("../testData/unit.data");

afterEach(deleteSlugDatabase);

test("Should Create and Save new Slug", async () => {
    const savedValidSlug = await new Slug(validSlug).save();
    expect(savedValidSlug._id).toBeDefined();
    expect(savedValidSlug.URL).toBe(validSlug.URL);
    expect(savedValidSlug.slug).toBe(validSlug.slug);
});

test("Should return validation error on wrong URL/slug", async () => {
    await new Slug(slugWithInvalidURL).save((err) => {
        if (err) {
            expect(err._message).toBe("Slug validation failed");
        }
    });
    await new Slug(slugWithInvalidSlug).save((err) => {
        if (err) {
            expect(err._message).toBe("Slug validation failed");
        }
    });
});
