const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const studentSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Generate Auth Token

studentSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (e) {
    console.log("Error : " + e);
  }
};

studentSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
  }
  next();
});
const Student = new mongoose.model("Register", studentSchema);

module.exports = Student;
