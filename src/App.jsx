import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-mock-interview-km5f.onrender.com";

/* ================= HOME ================= */

function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full animate-bounce"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-10 py-6 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-4xl font-black text-cyan-400 tracking-wide">
          AI Mock Interview
        </h1>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-cyan-400 transition">
            Home
          </Link>

          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-2xl text-black font-bold transition duration-300 shadow-lg shadow-cyan-500/30"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24">
        <div className="animate-pulse bg-cyan-500/20 border border-cyan-400/20 px-6 py-2 rounded-full mb-8">
          🚀 Next Generation AI Interview Platform
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-tight max-w-6xl">
          Crack Interviews With
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mt-4">
            AI Powered Practice
          </span>
        </h1>

        <p className="text-gray-400 text-xl mt-10 max-w-3xl leading-relaxed">
          Practice technical interviews with AI-generated questions,
          speech recognition, resume analysis, real-time feedback,
          and voice interview simulation.
        </p>

        <div className="flex gap-6 mt-12 flex-wrap justify-center">
          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-400 px-10 py-5 rounded-2xl text-black font-bold text-lg transition duration-300 shadow-xl shadow-cyan-500/30 hover:scale-105"
          >
            Start Interview
          </Link>

          <button className="border border-white/20 hover:border-cyan-400 px-10 py-5 rounded-2xl font-bold text-lg transition duration-300 hover:bg-white/10">
            Watch Demo
          </button>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-3 gap-8 px-10 py-24 max-w-7xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-105 transition duration-300 hover:border-cyan-400/30">
          <div className="text-5xl mb-6">🤖</div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            AI Feedback
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Get real-time AI evaluation with communication score,
            technical accuracy, confidence analysis and improvement tips.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-105 transition duration-300 hover:border-purple-400/30">
          <div className="text-5xl mb-6">🎤</div>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            Voice Interview
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Experience real interview simulations with speech recognition
            and voice-based AI questioning.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-105 transition duration-300 hover:border-green-400/30">
          <div className="text-5xl mb-6">📄</div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Resume Analysis
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Upload your resume and get personalized interview questions
            based on your skills and technologies.
          </p>
        </div>
      </div>

      <footer className="relative z-10 text-center text-gray-500 py-10 border-t border-white/10">
        © 2026 AI Mock Interview Platform • Built with React + Node.js + AI
      </footer>
    </div>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const registerUser = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email like example@gmail.com");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    alert(response.data.message);
  } catch (error) {
    console.log(error);
    alert("Register Failed");
  }
};
const loginUser = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email like example@gmail.com");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  } catch (error) {
    console.log(error);
    alert("Login Failed");
  }
};
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full animate-bounce"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-10 py-6 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-4xl font-black text-cyan-400 tracking-wide">
          AI Mock Interview
        </h1>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-cyan-400 transition">
            Home
          </Link>

          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-2xl text-black font-bold transition duration-300 shadow-lg shadow-cyan-500/30"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[85vh] px-5">
        <div className="w-full max-w-[430px] bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-10 shadow-2xl shadow-cyan-500/10">
          <h1 className="text-4xl font-black text-cyan-400 mb-4 text-center">
            Welcome Back 👋
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Register or login to start your AI interview practice.
          </p>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 focus:outline-none focus:border-cyan-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 focus:outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={registerUser}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-2xl text-black font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
          >
            Register
          </button>

          <button
            onClick={loginUser}
            className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl text-black font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const totalInterviews = history.length;
  const scores = history.map((item) => item.score || 0);

  const averageScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const latestScore = scores.length > 0 ? scores[0] : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    getHistory();

    return () => clearInterval(timer);
  }, []);

  const generateQuestions = async () => {
    const response = await axios.post(`${API_URL}/generate-questions`, {
      role,
      level,
    });

    setQuestions(response.data.questions);
  };

  const checkAnswer = async () => {
    const response = await axios.post(`${API_URL}/check-answer`, {
      answer,
    });

    setFeedback(response.data.feedback);
    setScore(response.data.score);
  };

  const saveInterview = async () => {
    await axios.post(`${API_URL}/save-interview`, {
      role,
      level,
      score,
      feedback,
    });

    alert("Interview Saved 🚀");
    getHistory();
  };

  const getHistory = async () => {
    const response = await axios.get(`${API_URL}/interview-history`);
    setHistory(response.data);
  };

  const deleteInterview = async (id) => {
    await axios.delete(`${API_URL}/delete-interview/${id}`);
    alert("Interview Deleted");
    getHistory();
  };

  const startSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition Not Supported");
      return;
    }

    const recognition = new SpeechRecognition();

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const startVoiceInterview = () => {
    const voiceQuestions = [
      "Tell me about yourself",
      `Why do you want to become a ${role}?`,
      "What is React?",
      "Explain JavaScript closures",
      "What are props in React?",
      "Difference between let and var?",
      "What is MongoDB?",
      "Explain API in simple words",
    ];

    const randomQuestion =
      voiceQuestions[Math.floor(Math.random() * voiceQuestions.length)];

    setQuestions([randomQuestion]);

    const speech = new SpeechSynthesisUtterance(randomQuestion);
    window.speechSynthesis.speak(speech);
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("resume", file);

    const response = await axios.post(`${API_URL}/upload-resume`, formData);

    setQuestions(response.data.questions);
    setResumeName(file.name);
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AI Mock Interview Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`Role: ${role}`, 20, 40);
    doc.text(`Level: ${level}`, 20, 55);
    doc.text(`Score: ${score}/10`, 20, 70);
    doc.text(`Interview Time: ${time} sec`, 20, 85);

    doc.text("AI Feedback:", 20, 105);

    doc.setFontSize(12);
    doc.text(feedback || "No feedback", 20, 120, {
      maxWidth: 170,
    });

    doc.save("interview-report.pdf");
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center border-b border-white/10 pb-6 mb-10">
        <h1 className="text-3xl font-bold text-cyan-400">
          AI Mock Interview
        </h1>

        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl text-black font-bold"
        >
          Logout
        </button>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-cyan-400 text-center mb-5">
          Dashboard 🚀
        </h1>

        <h2 className="text-center text-yellow-400 text-2xl mb-10">
          Interview Timer: {time}s
        </h2>

        <div className="grid md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white/5 border border-cyan-500/20 p-6 rounded-2xl">
            <h3 className="text-gray-400">Total Interviews</h3>
            <p className="text-4xl font-bold text-cyan-400">
              {totalInterviews}
            </p>
          </div>

          <div className="bg-white/5 border border-green-500/20 p-6 rounded-2xl">
            <h3 className="text-gray-400">Average Score</h3>
            <p className="text-4xl font-bold text-green-400">
              {averageScore}/10
            </p>
          </div>

          <div className="bg-white/5 border border-yellow-500/20 p-6 rounded-2xl">
            <h3 className="text-gray-400">Best Score</h3>
            <p className="text-4xl font-bold text-yellow-400">
              {bestScore}/10
            </p>
          </div>

          <div className="bg-white/5 border border-purple-500/20 p-6 rounded-2xl">
            <h3 className="text-gray-400">Latest Score</h3>
            <p className="text-4xl font-bold text-purple-400">
              {latestScore}/10
            </p>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-10"
        >
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-4 border-cyan-300 shadow-2xl shadow-cyan-500/40">
            <div className="text-6xl">🤖</div>
          </div>
        </motion.div>

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-4 rounded-xl bg-black border border-white/10 mb-5"
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-4 rounded-xl bg-black border border-white/10 mb-5"
        >
          <option value="">Select Level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={generateQuestions}
            className="bg-cyan-500 hover:bg-cyan-400 px-8 py-4 rounded-xl text-black font-bold"
          >
            Generate Questions
          </button>

          <button
            onClick={startVoiceInterview}
            className="bg-purple-500 hover:bg-purple-400 px-8 py-4 rounded-xl text-black font-bold"
          >
            Start Voice Interview
          </button>
        </div>

        <div className="mt-10">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-white/5 p-5 rounded-xl mb-4 border border-white/10"
            >
              {q}
            </div>
          ))}
        </div>

        <textarea
          placeholder="Write Your Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full h-[200px] mt-10 bg-black border border-white/10 rounded-xl p-4"
        />

        <div className="flex gap-5 mt-5 flex-wrap">
          <button
            onClick={startSpeechToText}
            className="bg-yellow-500 px-8 py-4 rounded-xl text-black font-bold"
          >
            {listening ? "Listening..." : "🎤 Speech To Text"}
          </button>

          <button
            onClick={checkAnswer}
            className="bg-green-500 px-8 py-4 rounded-xl text-black font-bold"
          >
            Check AI Answer
          </button>

          <button
            onClick={saveInterview}
            className="bg-blue-500 hover:bg-blue-400 px-8 py-4 rounded-xl text-black font-bold"
          >
            Save Interview
          </button>

          <button
            onClick={downloadReport}
            className="bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-xl text-black font-bold"
          >
            Download Report
          </button>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            AI Feedback
          </h2>

          <p className="text-green-400 whitespace-pre-wrap">{feedback}</p>
        </div>

        <div className="mt-10">
          <input type="file" onChange={uploadResume} />

          <p className="text-cyan-400 mt-3">{resumeName}</p>
        </div>

        <div className="mt-10 bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-cyan-400 mb-5">
            Interview History
          </h2>

          {history.length === 0 && (
            <p className="text-gray-400">No interviews saved yet.</p>
          )}

          {history.map((item, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 p-4 rounded-xl mb-4"
            >
              <p>Role: {item.role}</p>
              <p>Level: {item.level}</p>
              <p>Score: {item.score}/10</p>

              <p className="text-gray-400 whitespace-pre-wrap">
                {item.feedback}
              </p>

              <button
                onClick={() => deleteInterview(item._id)}
                className="mt-4 bg-red-500 hover:bg-red-400 px-5 py-2 rounded-xl text-black font-bold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}