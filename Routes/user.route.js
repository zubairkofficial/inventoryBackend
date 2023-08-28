let mongoose = require("mongoose");
let express = require("express");
let router = express.Router();
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require("express-validator");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

let User = require("../Models/User");
let Permisson = require("../Models/Permission");
const Helpers = require("../Helpers");
const { verifyToken } = require("../Helpers");
const Permission = require("../Models/Permission");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post(
  "/register-user",
  [
    check("name", "Name field is required").not().isEmpty(),
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Password length should be 8 to 16 characters").isLength({
      min: 8,
      max: 16,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    }
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(402).json({ message: "User already exists" });
    } else {
      password = await bcrypt.hash(password, 10);
      const request = { name, email, password };
      User.create(request, (error, data) => {
        if (error) {
          return res.status(402).json({ error: error });
        } else {
          return res.json(data);
        }
      });
    }
  }
);

router.post(
  "/login-user",
  [
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Enter a password to continue").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json(errors);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if(user.active){
      if (user.user_type != 0 ) {
        return res.status(402).json({ error: "Invalid email or password" });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, email }, Helpers.tokenKey, {
          expiresIn: "2h",
        });
        let permissions = null;
        if (user.user_role != null) {
          permissions = await Permission.find({$or:[{role_id:user.user_role._id}]});        
        }
        let data = {
          user,
          token,
          permissions,
        };
        return res.status(200).json(data);
      } else {
        return res.status(402).json({ error: "Invalid email or password" });
      }
    }else{
      return res.status(402).json({ error: "Account deactivated" });
    }
  }
);

router.get("/get-users", (req, res) => {
  if (verifyToken(req, res)) {
    User.find((error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

router.get("/get-profile/:id", (req, res) => {
  if (verifyToken(req, res)) {
    User.findById(req.params.id, (error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

router.post(
  "/update-profile",
  [
    check("name", "Name field is required").not().isEmpty(),
    check("email", "Please Enter a valid Email").isEmail(),
  ],
  async (req, res) => {
    if (verifyToken(req, res)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }

      const name = req.body.name;
      const email = req.body.email;
      let request = { name, email };

      const oldUser = await User.findOne({ email });

      if (oldUser && oldUser._id != req.body._id) {
        return res.status(402).json({ message: "Email already exists" });
      } else {
        User.findByIdAndUpdate(req.body._id, request, (error, data) => {
          if (error) {
            return res.status(402).json({ error: error });
          } else {
            return res
              .status(200)
              .json({ message: "Profile updated successfully" });
          }
        });
      }
    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
  }
);

router.post(
  "/update-password",
  [
    check("new_password").not().isEmpty().withMessage("New Password field is required").isLength({min: 8}).withMessage("Password must contain at least 8 characters"),
    check("password_confirmation", "Password Confirmation field is required")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (verifyToken(req, res)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }

      let password = req.body.new_password;
      let password_confirmation = req.body.password_confirmation;
      if (password != password_confirmation) {
        return res
          .status(402)
          .json({ message: "Confirm Password does not match" });
      }
      console.log(password);
      password = await bcrypt.hash(password, 10);
      console.log(password);
      let request = { password };

      User.findByIdAndUpdate(req.body._id, request, (error, data) => {
        if (error) {
          return res.status(402).json({ error: error });
        } else {
          console.log(data);
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        }
      });
    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
  }
);

router.post('/upload', upload.single("image"), (req, res) => {
  let request = { profile: req.file.filename };
  User.findByIdAndUpdate(req.body.user_id, request, (error, data) => {
    if(error){
      return res.status(402).json({error: error});
    }else{
      return res.status(200).json({message: "Profile picture updated successfully", user: data});
    }
  });
});

module.exports = router;
