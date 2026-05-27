const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("./models/User");
const Interview = require("./models/Interview");

require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= MULTER ================= */

const upload = multer({
  dest: "uploads/",
});

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected 🚀");
  })
  .catch((error) => {
    console.log("Mongo Error:", error);
  });

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.json({
    message: "AI Mock Interview Backend Running 🚀",
  });
});

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET
    );

    res.json({
      message:
        "User Registered Successfully 🚀",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login Successful 🚀",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= GENERATE QUESTIONS ================= */

app.post("/generate-questions", async (req, res) => {
  try {
    const { role } = req.body;

    const questions = [
      `What is ${role}?`,
      `Explain HTML CSS and JavaScript.`,
      `What is React?`,
      `Explain MongoDB.`,
      `Difference between let var and const?`,
      `Explain API in simple words.`,
      `Why do you want to become a ${role}?`,
      `What projects have you built?`,
      `Explain Node.js.`,
      `Frontend vs Backend?`,
    ];

    res.json({
      questions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

/* ================= CHECK ANSWER ================= */

app.post("/check-answer", async (req, res) => {
  try {
    const { answer } = req.body;

    let feedback = "";
    let score = 0;

    if (answer.length > 150) {
      score = 9;

      feedback = `
Score: 9/10 🔥

Communication:
Excellent communication skills.

Technical Accuracy:
Strong technical explanation.

Confidence:
Very confident answer.

Improvement Tips:
Add real-world examples.
`;
    } else if (answer.length > 70) {
      score = 7;

      feedback = `
Score: 7/10 😄

Communication:
Good communication.

Technical Accuracy:
Mostly correct answer.

Confidence:
Looks confident.

Improvement Tips:
Explain more deeply.
`;
    } else {
      score = 4;

      feedback = `
Score: 4/10 😅

Communication:
Answer too short.

Technical Accuracy:
Needs more detail.

Confidence:
Try speaking confidently.

Improvement Tips:
Write longer answer.
`;
    }

    res.json({
      feedback,
      score,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

/* ================= SAVE INTERVIEW ================= */

app.post("/save-interview", async (req, res) => {
  try {
    const { role, level, score, feedback } =
      req.body;

    const interview =
      await Interview.create({
        role,
        level,
        score,
        feedback,
      });

    res.json({
      message:
        "Interview Saved Successfully 🚀",
      interview,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Save Failed",
    });
  }
});

/* ================= INTERVIEW HISTORY ================= */

app.get("/interview-history", async (req, res) => {
  try {
    const interviews =
      await Interview.find().sort({
        createdAt: -1,
      });

    res.json(interviews);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching history",
    });
  }
});


app.delete("/delete-interview/:id", async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);

    res.json({
      message: "Interview Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete Failed",
    });
  }
});

/* ================= RESUME ================= */

app.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No File Uploaded",
        });
      }

      const questions = [
        "Tell me about yourself",
        "Explain your projects",
        "Why should we hire you?",
        "Explain React",
        "Explain JavaScript closures",
      ];

      res.json({
        questions,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Resume Upload Failed",
      });
    }
  }
);

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log(
    "Server running on port 5000 🚀"
  );
});