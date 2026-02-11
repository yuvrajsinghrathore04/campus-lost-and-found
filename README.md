# Campus Lost & Found Portal

A full-stack web application for managing lost and found items on a college campus. Built with React.js, Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: Register and login with JWT-based authentication and bcrypt password hashing
- **Post Items**: Report lost or found items with image upload, title, description, category, location, and date
- **Browse Items**: View all lost items and found items with search and category filtering
- **Item Details**: View detailed information about each item including contact details
- **User Dashboard**: View and manage your own posted items
- **Admin Dashboard**: Admin users can view and delete any item, and view all users
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Image Upload**: Upload item images using Multer (stored in /uploads folder)

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS 3
- Axios
- React Router DOM 6

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt.js
- Multer (image uploads)
- dotenv
- cors

## Project Structure
campus-lost-and-found/
├── backend/ # Express.js API server
│ ├── config/ # Database configuration
│ ├── controllers/ # Route handlers (MVC)
│ ├── middleware/ # Auth & admin middleware
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── uploads/ # Image storage
│ └── server.js # Entry point
├── frontend/ # React.js client
│ ├── src/
│ │ ├── api/ # Axios instance
│ │ ├── components/# Reusable components
│ │ ├── context/ # Auth context
│ │ └── pages/ # Page components
│ └── public/
└── README.md
