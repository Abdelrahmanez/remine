const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/Users");
app.use(express.json());

app.get("/hello", (req, res) => {
  let numbers = "";
  for (i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  res.send("Hello World, from cs309" + numbers);
});

app.get("/findSum/:num1/:num2", (req, res) => {
  const num1 = req.params.num1;
  const num2 = req.params.num2;
  const result = parseInt(num1) + parseInt(num2);
  console.log(typeof parseInt(num2));
  res.send("The sum is " + result);
});

app.post("/sum", (req, res) => {
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const result = parseInt(num1) + parseInt(num2);
  res.json({
    sum: result,
    number1: num1,
    number2: num2,
  });
});

app.get("/search/:name", (req, res) => {
  const name = req.params.name;
  if (!name) res.status(404).send("Name not found");
  const result = name + " is found";
  res.json({
    result: result,
    name: name,
    location: "Iowa City",
  });
});

app.get("/home", (req, res) => {
  let numbers = "";
  for (i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  res.render("home.ejs", {
    name: "Abdelrahman",
    age: "21",
    uni: "Cairo University",
    a: numbers,
  });
});

app.get("/about", (req, res) => {
  res.send("aasda");
});

app.get("/hi", (req, res) => {
  res.send("Hi world");
});

app.post("/addComment", (req, res) => {
  res.send("Comment added");
});

// ================================================

app.post("/addUser", async (req, res) => {
  const newUser = new Users();
  newUser.id = Users.length + 1;
  newUser.name = req.body.name;
  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.role = req.body.role;
  await newUser.save();
  res.send("User added");
});

app.get("/users", async (req, res) => {
  const users = await Users.find();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.send({ "no user found with id ": req.params.id });
  }
});

app.post("/checkout", async (req, res) => {
  const user = await Users.findById(req.body.id);
  if (!user) {
    res.status(404).send("please sign up first");
  } else {
    user.cart.push(req.body.product);
    await user.save();

    res.json(user);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.send({ "no user found with id ": req.params.id });
  }
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
