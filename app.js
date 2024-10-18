const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Set the view engine
app.set("view engine", "jade");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/campusRecruitment", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Set up session management
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/campusRecruitment",
    }),
  })
);

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Use the auth routes
app.use(authRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://127.0.0.1:3000");
});
