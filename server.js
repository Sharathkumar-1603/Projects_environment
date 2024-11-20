import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import multer from "multer"; // For handling file uploads
import nodemailer from "nodemailer"; // For sending email
import path from "path"; // Import the path module

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Use path module here

const reportsFilePath = `${__dirname}/reports.json`; // Path to store reports

// Enable CORS for all routes and origins
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));

// Middleware for JSON parsing and file upload
app.use(express.json());
const upload = multer({ dest: "uploads/" }); // Save uploaded images in the 'uploads' folder

// Helper function to read and write JSON files
const readReportsFile = () => {
  try {
    if (fs.existsSync(reportsFilePath)) {
      return JSON.parse(fs.readFileSync(reportsFilePath, "utf-8"));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
};

const writeReportsFile = (reports) => {
  try {
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

// Send email to client
const sendEmail = (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aginatijsspda@gmail.com", // Replace with your email
      pass: "Sharath@143", // Replace with your email password
    },
  });

  const mailOptions = {
    from: "agianatijsspda@gmail.cm", // Replace with your email
    to: email,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Route to get all reports
app.get("/reports", (req, res) => {
  const reports = readReportsFile();
  res.json(reports);
});

// Route to add a new report
app.post("/reports", upload.single("image"), (req, res) => {
  const { name, address, description, progress, latitude, longitude, email } = req.body;
  const image = req.file ? req.file.filename : null;

  const newReport = {
    id: Date.now(),
    name,
    address,
    description,
    progress,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    email,
    image,
    feedback: [],
  };

  const reports = readReportsFile();
  reports.push(newReport);
  writeReportsFile(reports);

  // Send email to client confirming report submission
  sendEmail(email, "Report Submitted", `Your report has been submitted successfully: ${description}`);

  res.status(201).json(newReport);
});

// Route to update report progress
app.put("/reports/:id/progress", (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  const reports = readReportsFile();
  const report = reports.find((r) => r.id === parseInt(id));

  if (report) {
    report.progress = progress;
    writeReportsFile(reports);
    res.status(200).json(report);
  } else {
    res.status(404).json({ message: "Report not found" });
  }
});

// Route to add feedback to a report
app.put("/reports/:id/feedback", (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  const reports = readReportsFile();
  const report = reports.find((r) => r.id === parseInt(id));

  if (report) {
    report.feedback.push(feedback);
    writeReportsFile(reports);
    res.status(200).json(report);
  } else {
    res.status(404).json({ message: "Report not found" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
