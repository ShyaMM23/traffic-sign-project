// =====================================================
// backend/server.js
// FULL LOGIN + REGISTER + MONGODB
// =====================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://10727deepak_db_user:deepak123@cluster0.ajzc9b0.mongodb.net/trafficdb?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.log(" DB Error:", err));

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("users", UserSchema);

app.get("/", (req, res) => {
  res.send(" Server Running");
});

// ======================================
// REGISTER
// ======================================
app.post("/register", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter all fields"
      });
    }

    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = new User({
      username,
      password
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Registered Successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Register Failed"
    });

  }

});

app.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password"
      });
    }

    res.json({
      success: true,
      message: "Login Success",
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Login Failed"
    });

  }

});

app.get("/users", async (req, res) => {

  const users = await User.find();

  res.json(users);

});
app.listen(5000, () => {
  console.log(" Server Running on Port 5000");

});