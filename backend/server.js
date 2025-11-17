const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const Task = require("./models/taskModel")
const cors = require("cors");
const taskRoutes = require("./routes/taskRoute")
const labelRoutes = require("./routes/labelRoute");
const authRoutes = require("./routes/authRoutes");

const app = express()

//Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://taskflow-three-sage.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({ 
  origin: (origin, callback) => {
    console.log("Request from origin:", origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add security headers for Google OAuth
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use(express.json()); 


// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Task Manager API");
});

//port
const PORT = process.env.PORT || 5000

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(
        app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    }))
    .catch((err) => console.log(err));


