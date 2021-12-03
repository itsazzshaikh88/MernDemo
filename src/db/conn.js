const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/student-registeration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(`Error : ${e}`);
  });
