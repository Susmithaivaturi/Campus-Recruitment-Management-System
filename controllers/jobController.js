const Job = require("../models/Job");
const Application = require("../models/Application");

// Handle job posting by officer
exports.postJob = async (req, res) => {
    try {
        const { jobTitle,jobDescription, company, location } = req.body;
        const newJob = new Job({ jobTitle, company, location, jobDescription });
        await newJob.save();
        res.redirect("/officerDashboard"); // Redirect back to officer dashboard after posting
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).send("Error posting job");
    }
};

// Handle fetching jobs for students
exports.viewJobs = async (req, res) => {
    try {
        const studentId = req.session.userId; // Get the logged-in student's ID

        // Fetch all jobs
        const jobs = await Job.find();

        // Fetch applications for the logged-in student
        const applications = await Application.find({ student: studentId });

        // Create an array of job IDs that the student has applied for
        const appliedJobs = applications.map(app => app.job.toString());

        // Render the jobs view and pass jobs and appliedJobs to the EJS template
        res.render("jobs", { jobs, appliedJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Error fetching jobs");
    }
};
