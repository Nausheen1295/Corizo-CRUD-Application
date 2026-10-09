# Corizo Student Management CRUD Application

A responsive full-stack Student Management application developed as part of my Corizo Web Development training.

## Live Demo

**Live Application:** https://corizo-student-management.onrender.com/

**GitHub Repository:** https://github.com/Nausheen1295/Corizo-CRUD-Application

## Overview

The application allows users to manage student records through a simple dashboard. It supports creating, viewing, updating, deleting, and searching student information.

## Features

- Create new student records
- View all registered students
- Update existing student details
- Delete student records with confirmation
- Search by student name, email, phone number, or course
- Validate required form fields
- Prevent duplicate email addresses
- Store records in MongoDB Atlas
- Responsive interface built with Bootstrap
- REST API built with Express.js

## Technology Stack

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas, Mongoose

**Tools:** Visual Studio Code, Git, GitHub, Render

## Project Structure

```text
Corizo-CRUD-Application/
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env
├── .gitignore
├── server.js
├── package.json
└── package-lock.json
```

## Run Locally

1. Install Node.js.
2. Clone this repository.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
   PORT=5000
   ```

5. Replace the placeholder with your own MongoDB Atlas connection string.
6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5000` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve all students |
| GET | `/api/students/:id` | Retrieve one student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/test` | Check API status |

Search example: `/api/students?search=Computer`

## Learning Outcomes

- Understanding CRUD operations and REST APIs
- Connecting a Node.js backend to MongoDB Atlas
- Implementing frontend/backend communication with Fetch API
- Organizing an application using models and routes
- Using Git and GitHub for version control
- Deploying a full-stack application to a cloud hosting platform

## Security Notes

- Database credentials must remain in environment variables.
- The `.env` file must not be committed to GitHub.
- Demo data should be fictional.
- Production deployments should use appropriate database access restrictions.

## Credits

Developed as part of Corizo Web Development training.
