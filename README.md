# 📋 TaskFlow - Task Management Application

A modern, full-stack task management web application built with the MERN stack. TaskFlow helps users organize their daily tasks with features like Google OAuth authentication, label-based categorization, calendar views, and intelligent task filtering.

🔗 **Live Demo**: [https://taskflow-three-sage.vercel.app/](https://taskflow-three-sage.vercel.app/)

![TaskFlow](https://img.shields.io/badge/MERN-Stack-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Express.js](https://img.shields.io/badge/Express.js-Backend-blue)
![React](https://img.shields.io/badge/React-Frontend-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933)
![Live](https://img.shields.io/badge/Live-Deployed-success)

## ✨ Features

### 🔐 Authentication
- **Google OAuth 2.0** - Secure login with Google accounts
- Session management with persistent user state
- Protected routes and API endpoints

### 📝 Task Management
- **Create, Read, Update, Delete** tasks with ease
- Set due dates and track completion status
- Add detailed descriptions to tasks
- Mark tasks as complete with timestamp tracking

### 🏷️ Label System
- Create custom labels with color coding
- Assign multiple labels to tasks
- Filter and organize tasks by labels
- Visual color indicators for quick identification

### 📅 Smart Views
- **Today** - View tasks due today
- **Upcoming** - See future scheduled tasks
- **Completed** - Track finished tasks with completion dates
- **Calendar** - Visual calendar view for task scheduling
- **All Tasks** - Complete task overview with filtering

### 💻 Desktop-Optimized Design
- Clean and modern desktop interface with Tailwind CSS
- Collapsible sidebar for efficient navigation
- Optimized for desktop and laptop screens
- _(Mobile responsiveness currently in development)_

### 🎨 Modern UI/UX
- Clean and intuitive desktop interface
- Real-time toast notifications
- Modal-based forms for task creation
- Active page highlighting in navigation
- Smooth transitions and animations
- Best viewed on desktop browsers

## 🛠️ Technologies Used

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Icons** - Icon components
- **React Toastify** - Toast notifications
- **@react-oauth/google** - Google OAuth integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Authentication provider

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RLDSandaruwan/Task-Manager.git
cd Task-Manager
```

2. **Backend Setup**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

3. **Frontend Setup**
```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `frontend/.env`:
```env
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Start the Application**

In separate terminals:

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production frontend URL
6. Add authorized redirect URIs:
   - `http://localhost:3000`
   - Your production frontend URL
7. Copy Client ID and Client Secret to your `.env` files

## 📁 Project Structure

```
Task-Manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── labelController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── taskModel.js
│   │   └── labelModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoute.js
│   │   └── labelRoute.js
│   ├── passportConfigure.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Completed.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Labels.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NewTask.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskList.js
│   │   │   ├── Today.jsx
│   │   │   └── Upcoming.jsx
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login

### Tasks
- `GET /api/tasks/user/:userId` - Get all tasks for user
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Labels
- `GET /api/labels?userId=:userId` - Get all labels for user
- `POST /api/labels` - Create new label
- `PUT /api/labels/:id` - Update label
- `DELETE /api/labels/:id` - Delete label

## 🎯 Features Breakdown

### Task Filtering
- Filter by completion status (All, Pending, Completed)
- Filter by date (Today, Upcoming, Overdue)
- Filter by custom labels
- Combine multiple filters

### Task Organization
- Sort tasks by due date
- Visual indicators for overdue tasks
- Completion percentage tracking
- Task counter in each view

### User Experience
- Auto-save functionality
- Persistent login sessions
- Loading states with animations
- Error handling with user feedback
- Responsive modal dialogs

## 👤 Author

**RLD Sandaruwan**

- GitHub: [@RLDSandaruwan](https://github.com/RLDSandaruwan)

## 🙏 Acknowledgments

- Google OAuth for authentication
- MongoDB Atlas for database hosting
- Vercel & Railway for deployment
- React community for amazing libraries
- Tailwind CSS for beautiful styling

## 📸 Screenshots

### Login Page
Beautiful login interface with Google OAuth integration

### Dashboard
Main task management interface with sidebar navigation

### Calendar View
Visual calendar for task scheduling

### Task Management
Organized views for today, upcoming, and completed tasks

---

⭐ If you find this project useful, please consider giving it a star!
