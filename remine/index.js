const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/Users");
const isNegative = require("./validations/validation");
const containsOnlyNumbers = require("./validations/validation");
const isEmail = require("./validations/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
cookieParser = require("cookie-parser");
app.use(express.json());

app.post("/register", async (req, res) => {
  if (req.body.password.length < 8 || req.body.password.length > 30)
    return res
      .status(200)
      .send({ status: "error", message: "password is too short" });
  if (
    req.body.phone.length < 11 ||
    req.body.phone.length > 11 ||
    isNaN(req.body.phone)
  )
    return res
      .status(200)
      .send({ status: "error", message: "please enter a valid phone number" });
  if (!isEmail(req.body.email))
    return res
      .status(200)
      .send({ status: "error", message: "please enter a valid email" });
  if (req.body.userName.length < 3 || req.body.userName.length > 30)
    return res
      .status(200)
      .send({ status: "error", message: "please enter a valid username" });
  if (req.body.name.length < 3 || req.body.name.length > 30)
    return res
      .status(200)
      .send({ status: "error", message: "please enter a valid username" });
  const findEmail = await Users.findOne({ email: req.body.email });
  if (findEmail)
    return res
      .status(200)
      .send({ status: "error", message: "email already exists" });
  const findUserName = await Users.findOne({ userName: req.body.userName });
  if (findUserName)
    return res
      .status(200)
      .send({ status: "error", message: "User name already exists" });
  const findPhoneNum = await Users.findOne({ phone: req.body.phone });
  if (findPhoneNum)
    return res
      .status(200)
      .send({ status: "error", message: "phone already exists" });
  if (req.body.password !== req.body.confirmPassword) {
    return res
      .status(200)
      .send({ status: "error", message: "passwords do not match" });
  }
  const hashPassword = await bcrypt.hashSync(req.body.password, 10);
  const UsersLength = await Users.find().count();
  const user = new Users({
    id: UsersLength + 1,
    userName: req.body.userName,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/user/:id", async (req, res) => {
  const findUser = await Users.find({ id: req.params.id });
  if (findUser)
    return res
      .status(200)
      .send({ status: "error", message: "There is no user With this id" });
  try {
    const user = await Users.find({ id: req.params.id });
    res.send(user);
  } catch {
    res.status(404).send("User not found " + Error);
  }
});

app.post("/login/", async (req, res) => {
  const user = await Users.findOne({ userName: req.body.userName });
  if (!user || bcrypt.compare(req.body.password, user.password) == false) {
    return res.status(400).json({ message: "invalid credintials" });
  }
  const accessToken = jwt.sign(
    {
      id: findUser._id,
      admin: findUser.admin,
    },
    process.env.JWT_KEY,
    { expiresIn: "2d" }
  );
  const token = jwt.sign({ userId: user._id }, "your-secret-key");
  res.cookie("token", token, { httpOnly: true });
  res.json({ token });
  console.log(token);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/SolveForGood")
  .then(() => {
    console.log("connected to MongoDB");
    //listen on specific port
  })
  .catch((error) => {
    console.log("cant connect to mongodb " + error);
  });
