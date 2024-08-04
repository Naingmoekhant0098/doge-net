const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
exports.signUp = async (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const isUser = await User.findOne({ email: req.body.email });

  if (isUser) {
    res.status(409).json("Error ,User already exist !");
  }
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(500).json("Error , Please fill all requried fields !");
  }

  const user = new User({
    username: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const saveUser = await user.save();
    const { password: pass, ...rest } = saveUser._doc;
    const token = jwt.sign(
      {
        id: saveUser._id,
        isAdmin: saveUser.isAdmin,
      },
      process.env.jwt_token,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      user: { ...rest, token: token },
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.signIn = async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.body.email });
 
    if (!isUser) {
       res.status(404).json("User with this email not found!");
    }
    const isMatch = bcrypt.compareSync(req.body.password, isUser.password);
    if (!isMatch) {
      res.status(403).json("Password do not match!");
    }

    const { password: pass, ...rest } = isUser._doc;
    const token = jwt.sign(
      {
        id: isUser._id,
        isAdmin: isUser.isAdmin,
      },
      process.env.jwt_token,
      {
        expiresIn: "30d",
      }
    );

   res.status(200).json({
    user : {...rest, token : token}
   })
  } catch (error) {
    
  }
};
