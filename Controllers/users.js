
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const emailExists = await userModel.findOne({ email: email });
    if (emailExists) {
      res.status(401).json({
        error: true,
        message: "Email already exists",
        data: null,
      });
    } else {
      const saltRounds = 10;
      // salting
      const salt = await bcrypt.genSalt(saltRounds);
      console.log("salt==>",salt);
      // hashing
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("hashedPassword==>",hashedPassword);
      await userModel.insertMany([
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      ]);
      res.status(200).json({
        error: false,
        message: "User Registration Successfull",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.findOne({ email }).lean();
    // res.json(userData);
    // return
    if (userData) {
      const { firstName, lastName } = userData;
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      console.log('isPasswordMatch :>> ', isPasswordMatch);
      if (isPasswordMatch) {
        const payload = {
          firstName,
          lastName,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "10h",
        });
        res.status(200).json({
          error: false,
          message: "Login successfull",
          data: {
            payload, // or fname, lname, role
            token,
          },
        });
      } else {
        res.status(401).json({
          error: true,
          message: "Invalid Password",
          data: null,
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "Email already exist, Please create account",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};


