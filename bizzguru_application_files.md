# BizzGuru Application Files

This document contains the structure and key files for the BizzGuru application that need to be uploaded to your A2 Hosting server.

## Directory Structure

```
bizzguru/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── hooks/
    │   ├── context/
    │   └── App.js
    ├── public/
    │   ├── brand/
    │   └── index.html
    └── package.json
```

## Key Backend Files

### src/index.js
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const contentRoutes = require('./routes/content.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Routes
app.use('/api/content', authMiddleware, contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BizzGuru API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### package.json
```json
{
  "name": "bizzguru-backend",
  "version": "1.0.0",
  "description": "BizzGuru AI-powered content management platform backend",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "openai": "^4.20.0",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.35.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3"
  }
}
```

### .env
```
PORT=8080
NODE_ENV=production
DB_HOST=localhost
DB_NAME=bizzguru_db
DB_USER=bizzguru_user
DB_PASSWORD=your_database_password
JWT_SECRET=generate_a_random_string_here
OPENAI_API_KEY=your_openai_api_key
```

## Key Frontend Files

### src/App.js
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import ContentGeneration from './pages/content-generation';
import PlatformManagement from './pages/platform-management';
import Settings from './pages/settings';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/content" element={<PrivateRoute><ContentGeneration /></PrivateRoute>} />
          <Route path="/platforms" element={<PrivateRoute><PlatformManagement /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### package.json
```json
{
  "name": "bizzguru-frontend",
  "version": "1.0.0",
  "description": "BizzGuru AI-powered content management platform frontend",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.3.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### src/services/api.js
```javascript
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://bizzguru.de/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Content generation service
export const generateContent = async (contentType, prompt, platformId) => {
  try {
    const response = await api.post('/content/generate', {
      contentType,
      prompt,
      platformId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error generating content' };
  }
};

// Platform connection service
export const connectPlatform = async (platformType, credentials) => {
  try {
    const response = await api.post('/platforms/connect', {
      platformType,
      credentials,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error connecting platform' };
  }
};

// Authentication services
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export default api;
```

## Deployment Notes

1. **Environment Variables**: Make sure to update the `.env` file with your actual database credentials and OpenAI API key.

2. **API URL**: Update the frontend API URL in `src/services/api.js` to match your domain.

3. **Database Models**: The application expects the database models to be created. The backend will handle this if you set `sync: { force: false }` in your Sequelize configuration.

4. **Static Files**: After building the frontend, the static files will be in the `build` directory. These need to be served by your Node.js application or a web server.

5. **CORS Configuration**: Update the CORS configuration in the backend to allow requests from your domain.

6. **SSL**: For production, ensure you're using HTTPS by setting up SSL certificates for your domain.

7. **Process Management**: Use PM2 or a similar tool to keep your Node.js application running.

These files provide the basic structure for the BizzGuru application. You'll need to create additional files for controllers, models, routes, and components based on the application requirements.
