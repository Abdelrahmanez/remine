const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/Users");
// const isNegative = require("./validations/validation");
const containsOnlyNumbers = require("./validations/validation");
const isEmail = require("./validations/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
cookieParser = require("cookie-parser");
const Products = require("./models/products");
const path = require("path");
app.use(express.json());
const secretKey = "remineSecretKey";
app.use(cookieParser());

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

// const isAdmin = async (token) => {
//   if (!token) {
//     return { error: "You are not authorized" };
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     const user = await Users.findById(decoded.userId);
//     if (!user.isAdmin) {
//       return { error: "You are not authorized" };
//     }
//     return { user };
//   } catch (error) {
//     return { error: "Internal server error" };
//   }
// };

const isNegative = async (amount) => {
  if (amount < 0) {
    return true;
  }
};
const getUserByToken = async (token) => {
  if (!token) {
    return { error: "You are not authorized" };
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await Users.findById(decoded.userId);
    return { user };
  } catch (error) {
    return { error: "Internal server error" };
  }
};

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

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await Users.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.json({ token });
  } catch (error) {
    console.log("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});
// -----------------products-----------------//
app.post("/addproduct", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, secretKey);
  const user = await Users.findById(decoded.userId);
  if (!user.isAdmin) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  const productsLength = await Products.find().count();
  if (req.body.price < 0) {
    return res
      .status(200)
      .send({ status: "error", message: "please enter a positive amount" });
  }
  const Product = new Products({
    p_id: productsLength + 1,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    subCategory: req.body.subCategory,
    description: req.body.description,
    image: req.body.image,
    size: req.body.size,
  });
  res.json(Product);
  await Product.save();
});

app.get("/products", async (req, res) => {
  const products = await Products.find();
  res.json(products);
});
app.get("/products/:id", async (req, res) => {
  const product = await Products.find({ p_id: req.params.id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});
app.delete("/products/:id", async (req, res) => {
  isAdmin(req.cookies.token);
  const product = await Products.findOne({ p_id: req.params.id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.remove();
  res.json({ message: "Product removed" });
});
// partial update of product
app.patch("/products/:id", async (req, res) => {
  const product = await Products.findOne({ p_id: req.params.id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (req.body.name != null) {
    product.name = req.body.name;
  }
  if (req.body.category != null) {
    product.category = req.body.category;
  }
  if (req.body.price != null) {
    product.price = req.body.price;
  }
  if (req.body.quantity != null) {
    product.quantity = req.body.quantity;
  }
  if (req.body.subCategory != null) {
    product.subCategory = req.body.subCategory;
  }
  if (req.body.description != null) {
    product.description = req.body.description;
  }
  if (req.body.image != null) {
    product.image = req.body.image;
  }
  if (req.body.size != null) {
    product.size = req.body.size;
  }
  if (req.body.isAvailable != null) {
    product.isAvailable = req.body.isAvailable;
  }
  // product.name = req.body.name;
  // product.category = req.body.category;
  // product.price = req.body.price;
  // product.quantity = req.body.quantity;
  // product.subCategory = req.body.subCategory;
  // product.description = req.body.description;
  // product.image = req.body.image;
  // product.size = req.body.size;
  await product.save();
  res.json({ message: "Product updated" });
});
app.get("/category/:category", async (req, res) => {
  const products = await Products.find({ category: req.params.category });
  res.json(products);
});
app.get("/search/:name", async (req, res) => {
  const products = await Products.find({ name: req.params.name });
  res.json(products);
});
app.get("/subCategory/:subCategory", async (req, res) => {
  const products = await Products.find({
    subCategory: req.params.subCategory,
  });
  res.json(products);
});
// -----------------cart-----------------//
app.post("/addToCart", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  const product = req.body.product;
  const quantity = req.body.quantity;
  const productResult = await Products.findOne({ p_id: product.p_id });

  if (productResult.quantity < quantity) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (!productResult) {
    return res.status(404).json({ message: "Product not found" });
  }
  user.cart.push(product + quantity + size + totalPrice);
  productResult.quantity -= quantity;
  await user.save();
  res.send(user);
});

app.post("/removeFromCart", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  const product = req.body.product;
  user.cart.pull(product);
  await user.save();
  res.send(user);
});
app.post("/checkout", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  const product = req.body.product;
  user.cart.pull(product);
  await user.save();
  res.send(user);
});
app.post("/addAddress", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  const address = req.body.address;
  user.addresses.push(address);
  await user.save();
  res.send(user);
});
app.post("/removeAddress", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  const address = req.body.address;
  user.addresses.pull(address);
  await user.save();
  res.send(user);
});
app.get("/cart", async (req, res) => {
  const token = req.cookies.token;
  const userResult = await getUserByToken(token);
  const user = userResult.user;
  res.send(user.cart);
});

// ---------------- wallet-----------------//
app.post("/addmoney", async (req, res) => {
  if (req.body.amount < 0) {
    return res
      .status(200)
      .send({ status: "error", message: "please enter a positive amount" });
  }
  try {
    const token = req.cookies.token;
    const userResult = await getUserByToken(token);
    const currentUser = await userResult.user;
    currentUser.wallet += parseInt(req.body.amount);
    res.send(currentUser);
    await currentUser.save();
  } catch (error) {
    return { error: "please enter a true amount" };
  }
});

app.get("/usersbytoken", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await Users.findById(decoded.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/createAdmin/:id", async (req, res) => {
  // make isAdmin true
  const token = req.cookies.token;
  const decoded = jwt.verify(token, secretKey);
  const user = await Users.findById(decoded.userId);
  if (!user.isAdmin) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  const admin = await Users.findOne({ id: req.params.id });
  if (!admin) {
    return res.status(404).json({ message: "User not found" });
  }
  admin.isAdmin = true;
  await Users.save(admin);
  res.json({ message: "Admin created" });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
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
