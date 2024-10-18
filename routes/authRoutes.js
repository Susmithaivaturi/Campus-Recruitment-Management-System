const express = require("express");
const router = express.Router();
const path=require('path')
const authController = require("../controllers/authController");
const jobController = require("../controllers/jobController");
const User = require("../models/User");

// Routes for register and login
router.get("/register", (req, res) => res.render("register"));
router.post("/register", authController.registerUser);

router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

// Dashboard routes
router.get("/studentDashboard", authController.isLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId; // Get the logged-in user's ID
        const user = await User.findById(userId); // Fetch the user's details from the database

        // Send the user data along with the HTML file
        res.render("studentDashboard", { user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data.");
    }
});

router.get("/officerDashboard", authController.isLoggedIn, (req, res) => {
    res.render("officerDashboard");
});

// Job posting route
router.post("/postJob", jobController.postJob);

// Route to view jobs for students
router.get("/jobs", authController.isLoggedIn, jobController.viewJobs);
router.get("/studentApplications", authController.isLoggedIn, authController.viewStudentApplications);
router.get("/jobApplications", authController.isLoggedIn, authController.viewOfficerApplications);
// Route to manage job application status
router.post('/manageApplication', authController.manageApplication);
router.post("/applyJob", authController.applyJob);
router.post("/acceptApplication", authController.acceptApplication);
router.post("/rejectApplication", authController.rejectApplication);


module.exports = router;
