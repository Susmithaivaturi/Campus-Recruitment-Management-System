const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://susmitha:susmic39@cluster0.tp7gu.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// Serve static HTML files for register and login
app.use(express.static(path.join(__dirname, "views")));

// Use the auth routes
app.use(authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://127.0.0.1:3000");
});
