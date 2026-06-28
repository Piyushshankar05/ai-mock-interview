const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require("./models/User");
const Interview = require("./models/Interview");

require("dotenv").config();

const app = express();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

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

/* ================= GENERATE QUESTIONS WITH GEMINI ================= */

app.post("/generate-questions", async (req, res) => {
  try {
    const role =
      req.body.role && req.body.role.trim() !== ""
        ? req.body.role.trim()
        : "Software Developer";

    const level =
      req.body.level && req.body.level.trim() !== ""
        ? req.body.level.trim()
        : "Beginner";

    console.log("Gemini Route Hit ✅");
    console.log("Role:", role);
    console.log("Level:", level);

    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY missing ❌");

      return res.status(500).json({
        message: "Gemini API key missing",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Generate exactly 10 interview questions for the role: ${role}.
Difficulty level: ${level}.

Rules:
- Questions must be specific to the given role.
- Do not give answers.
- Do not give explanation.
- Return each question on a new line.
- Do not use markdown headings.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("Gemini Response ✅");
    console.log(text);

    let questions = text
      .split("\n")
      .map((q) =>
        q
          .replace(/^\d+[\).\s-]*/, "")
          .replace(/^[-*]\s*/, "")
          .trim()
      )
      .filter((q) => q !== "");

    if (questions.length === 0) {
      questions = [
        `What is ${role}?`,
        `Explain important skills required for ${role}.`,
        `What are common challenges faced by a ${role}?`,
        `Explain your experience related to ${role}.`,
        `Why do you want to become a ${role}?`,
      ];
    }

    res.json({
      questions,
    });
  } catch (error) {
    console.log("Gemini Error ❌");
    console.log(error);

    const role =
      req.body.role && req.body.role.trim() !== ""
        ? req.body.role.trim()
        : "Software Developer";

    const fallbackQuestions = [
      `What is ${role}?`,
      `Explain important skills required for ${role}.`,
      `What are common tools used by a ${role}?`,
      `What challenges can a ${role} face?`,
      `Why do you want to become a ${role}?`,
      `Explain one project related to ${role}.`,
      `How do you improve your skills as a ${role}?`,
      `What are your strengths for this ${role} role?`,
      `How do you handle pressure in this role?`,
      `Where do you see yourself in this career?`,
    ];

    res.json({
      questions: fallbackQuestions,
      note: "Gemini failed, fallback questions used",
    });
  }
});

/* ================= CHECK ANSWER WITH GEMINI ================= */

app.post("/check-answer", async (req, res) => {
  try {
    const { answer, role, level, question } = req.body;

    if (!answer || answer.trim().length < 10) {
      return res.json({
        score: 2,
        feedback: `
Score: 2/10 😅

Communication:
Answer is too short.

Technical Accuracy:
Not enough information to evaluate.

Confidence:
Needs improvement.

Improvement Tips:
Write a complete answer with explanation and example.
`,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        score: 4,
        feedback: `
Score: 4/10

Communication:
Basic answer.

Technical Accuracy:
Could not check with AI because API key is missing.

Confidence:
Needs improvement.

Improvement Tips:
Check backend environment variable GEMINI_API_KEY.
`,
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are an interview evaluator.

Role: ${role || "Not provided"}
Level: ${level || "Not provided"}
Question: ${question || "Not provided"}
Candidate Answer: ${answer}

Evaluate the answer honestly.

Rules:
- If answer is random, unrelated, copied, or very weak, give low score.
- If answer is short but somewhat relevant, give medium-low score.
- If answer is correct, structured, and role-specific, give high score.
- Be strict. Do not give 9/10 unless answer is excellent.

Return feedback in this exact format:

Score: X/10

Communication:
...

Technical Accuracy:
...

Confidence:
...

Improvement Tips:
...
`;

    const result = await model.generateContent(prompt);

    const feedback = result.response.text();

    const scoreMatch = feedback.match(/Score:\s*(\d+)/i);

    let score = scoreMatch ? Number(scoreMatch[1]) : 5;

    if (score > 10) score = 10;
    if (score < 0) score = 0;

    res.json({
      score,
      feedback,
    });
  } catch (error) {
    console.log("Gemini Answer Check Error ❌", error);

    res.json({
      score: 5,
      feedback: `
Score: 5/10

Communication:
Average response.

Technical Accuracy:
AI evaluation failed, so this is fallback feedback.

Confidence:
Needs improvement.

Improvement Tips:
Try again after some time. Make sure your answer is clear and related to the question.
`,
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

/* ================= DELETE INTERVIEW ================= */

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