# Nexathon - Item Rental Platform 🤝

A full-stack web application for peer-to-peer item rentals with real-time booking management.

## Features

- User authentication and authorization
- Item listing and management
- Real-time booking system
- Location-based item search using Leaflet maps
- File uploads with image support
- Real-time notifications using Socket.IO
- Secure payment status tracking
- Two-way return confirmation system

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communications
- JWT authentication
- Winston for logging
- Express Validator for input validation

### Frontend
- React (Vite)
- React Router for navigation
- Formik & Yup for form handling
- Leaflet for maps integration
- Tailwind CSS for styling
- Socket.IO client for real-time features
- Axios for API calls

## Project Structure

```
nexathon/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   └── package.json       # Frontend dependencies
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Request handlers
    │   └── models/        # Database models
    └── package.json       # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd nexathon
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create `.env` files:

Backend `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

- [Aayush](https://github.com/Aayush-Duhan) - Full Stack Developer
- [Udit Sharma](https://github.com/UditSharma04) - Full Stack Developer

---


## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the initial project setup
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting

---

<div align="center">
  <p>Made with ❤ for developers, by developers.</p>
  <p>© 2025 ShareHub. All rights reserved.</p>
</div>

