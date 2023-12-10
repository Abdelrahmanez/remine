function isNegative(n) {
  if (n < 0) {
    res.send("please enter a non negative number");
  }
}

function containsOnlyNumbers(n) {
  if (isNaN(n)) {
    res.send("please enter a number");
  }
}

function isEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

async function emailAlreadyExist(Email) {
  const emailExist = await Users.findOne({ email: Email });
  if (emailExist)
    return res
      .status(200)
      .send({ status: "error", message: "email already exists" });
}
async function phoneAlreadyExist(Phone) {
  const phoneExist = await Users.findOne({ phone: Phone });
  if (phoneExist)
    return res
      .status(200)
      .send({ status: "error", message: "Phone already exists" });
}
async function userNameExist(UserName) {
  const userNameExist = await Users.findOne({ userName: UserName });
  if (userNameExist)
    return res
      .status(200)
      .send({ status: "error", message: "User name already exists" });
}
module.exports = emailAlreadyExist;
module.exports = phoneAlreadyExist;
module.exports = userNameExist;
module.exports = isNegative;
module.exports = containsOnlyNumbers;
module.exports = isEmail;
