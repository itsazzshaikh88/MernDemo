require('dotenv').config();
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 8000;
require("./db/conn");
const bcrypt = require("bcryptjs");
const Student = require("./models/registration");

// PATH DECLARATION -------------
const public_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

// SET ENGINE
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partial_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/register", async (req, res) => {
  try {
    const pass = req.body.password;
    const confirm = req.body.confirm;
    if (pass === confirm) {
      // save data
      const studentRegister = new Student({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirm,
      });

      // Generate Token
      const token = await studentRegister.generateAuthToken();

      const result = await studentRegister.save();
      res.status(201).send("Record Saved");
    } else {
      res.status(400).send("Password Not Matched");
    }
  } catch (e) {
    res.send(`Error : ${e}`);
  }
});

// Login Function Code
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const result = await Student.findOne({ email: email });

    const match = await bcrypt.compare(password, result.password);
    const token = await result.generateAuthToken();

    if (match) {
      res.status(200).send("Login Successful");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (e) {
    res.status(400).send("Invalid Credentials");
  }
});

app.listen(port, () => {
  console.log(`Listening to Port # ${port}`);
});
