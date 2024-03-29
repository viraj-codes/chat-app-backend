
const bcrypt = require("bcryptjs");
const userModel = require("../Models/users");
const jwt = require("jsonwebtoken");


const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);
    console.log('user', user)
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

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
  }  catch (err) { res.status(500).json(err); }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.findOne({ email }).lean();
    console.log('userData :>> ', userData);
    // res.json(userData);
    // return
    if (userData) {
      const { firstName, lastName,_id } = userData;
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      console.log('isPasswordMatch :>> ', isPasswordMatch);
      if (isPasswordMatch) {
        const payload = {
          firstName,
          lastName,
          _id,
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
  }  catch (err) { res.status(500).json(err); }
};

module.exports = {
  register,
  login,
  getUser,
};


