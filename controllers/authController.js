const User = require("../models/User");
const bcrypt = require("bcryptjs");
const JobApplication = require('../models/Job');
const Application = require('../models/Application');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Store user ID in session and redirect to the appropriate dashboard
    req.session.userId = newUser._id;
    if (role === "student") {
        res.redirect("/studentDashboard");
    } else if (role === "officer") {
        res.redirect("/officerDashboard");
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.redirect("/login");
    }

    // Compare entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.redirect("/login");
    }

    // Store user ID in session and redirect to respective dashboard
    req.session.userId = user._id;

    if (user.role === "student") {
        res.redirect("/studentDashboard");
    } else if (user.role === "officer") {
        res.redirect("/officerDashboard");
    }
};

// Logout the user
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/");
        }
        res.redirect("/login");
    });
};

// Middleware to check if user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/login");
    }
};

// Handle job application
exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.session.userId; // Get the logged-in student's ID

        // Check if the student already applied to the job
        const existingApplication = await Application.findOne({ student: studentId, job: jobId });
        if (existingApplication) {
            return res.status(400).send('You have already applied for this job.');
        }

        // Create a new job application entry
        const newApplication = new Application({
            student: studentId,
            job: jobId,
            status: 'Applied' // Initial status
        });

        await newApplication.save();
        // res.status(201).send('Job application submitted successfully.');
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).send('Error applying for job.');
    }
};

// Accept job application
exports.acceptApplication = async (req, res) => {
    try {
        const { applicationId } = req.body;

        await Application.findByIdAndUpdate(applicationId, { status: 'Accepted' });
        // res.status(200).send('Application accepted.');
    } catch (error) {
        console.error('Error accepting application:', error);
        res.status(500).send('Error accepting application.');
    }
};

// Reject job application
exports.rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.body;

        await Application.findByIdAndUpdate(applicationId, { status: 'Rejected' });
        // res.status(200).send('Application rejected.');
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).send('Error rejecting application.');
    }
};

// Fetch and display the officer's job applications
exports.viewOfficerApplications = async (req, res) => {
    try {
        // Fetch all applications with student details
        const applications = await Application.find().populate('student job');

        // Render the officer's applications view, passing in the applications
        res.render("jobApplications", { applications });
    } catch (error) {
        console.error("Error fetching officer applications:", error);
        res.status(500).send("Error fetching officer applications.");
    }
};

// Manage job application status
exports.manageApplication = async (req, res) => {
    try {
        const { applicationId, action } = req.body;

        let status;
        switch (action) {
            case 'accept':
                status = 'Accepted';
                break;
            case 'reject':
                status = 'Rejected';
                break;
            case 'processing':
                status = 'In Process';
                break;
            default:
                return res.status(400).send('Invalid action');
        }

        await Application.findByIdAndUpdate(applicationId, { status });
        res.status(200).send(`Application ${status}.`);
    } catch (error) {
        console.error('Error managing application:', error);
        res.status(500).send('Error managing application.');
    }
};


// Fetch and display the student's job applications
exports.viewStudentApplications = async (req, res) => {
    try {
        const studentId = req.session.userId; // Get the logged-in student's ID

        // Fetch applications by the logged-in student
        const applications = await Application.find({ student: studentId }).populate('job');

        // Render the 'studentApplications.ejs' view, passing in the applications
        res.render("studentApplications", { applications });
    } catch (error) {
        console.error("Error fetching student applications:", error);
        res.status(500).send("Error fetching student applications.");
    }
};
