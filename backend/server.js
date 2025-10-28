const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const Task = require("./models/taskModel")
const cors = require("cors");
const taskRoutes = require("./routes/taskRoute")


const app = express()

//Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); 
app.use("/api/tasks",taskRoutes);


//Routes
app.get("/", (req, res) => {
    res.send("Home page");
});

//port
const PORT = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI)
    .then(
        app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    }))
    .catch((err) => console.log(err));


