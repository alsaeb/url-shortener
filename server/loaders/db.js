const mongoose = require("mongoose");

mongoose
.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to database");
})
.catch((err) => {
    throw new Error(err);
});
