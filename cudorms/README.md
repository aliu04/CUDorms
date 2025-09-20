# CUDorms - Cornell University Dormitory Management System

A full-stack MERN application that helps Cornell students discover, review, and learn about campus dormitories with an integrated blog system for sharing experiences and tips.

## 🚀 Features

### Core Functionality

- **Dorm Discovery**: Browse and search through Cornell dormitories with detailed information
- **Advanced Filtering**: Filter dorms by year eligibility, ratings, amenities, and location
- **Detailed Dorm Information**: Comprehensive dorm profiles with amenities, room types, pricing, and policies
- **User Reviews & Ratings**: Students can rate and review their dorm experiences
- **Blog System**: General blog posts and dorm-specific content sharing

### Authentication & User Management

- **JWT Authentication**: Secure user registration and login
- **User Profiles**: Manage personal information and preferences
- **Role-based Access**: Student and admin user roles
- **Password Management**: Secure password handling with bcrypt

### Blog Features

- **Content Creation**: Write and publish blog posts about dorm life
- **Categorization**: Organize posts by type (general, dorm-specific, reviews, tips, news)
- **Interactive Features**: Like posts, comment, and engage with content
- **Search & Filter**: Find relevant blog content easily

### Admin Features

- **Dorm Management**: Add, edit, and delete dorm listings
- **Content Moderation**: Manage blog posts and user content
- **User Management**: Oversee user accounts and permissions

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **Modern CSS** with responsive design

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
cudorms/
├── frontend/             # React frontend application
│   ├── src/             # Source code
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   ├── styles/      # CSS stylesheets
│   │   └── interfaces.ts # TypeScript type definitions
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── vite.config.ts   # Vite configuration
├── backend/             # Node.js backend API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── server/          # Server configuration
│   ├── package.json     # Backend dependencies
│   └── seed-dorms.js    # Database seeder
├── package.json         # Root package.json with workspace scripts
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cudorms
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:

   ```env
   MONGODB_URL=your_mongodb_connection_string
   PORT=4000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the development servers**

   Start both frontend and backend:

   ```bash
   npm run dev
   ```

   Or start them separately:

   ```bash
   npm run dev:frontend  # Frontend on http://localhost:5173
   npm run dev:backend   # Backend on http://localhost:4000
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### Database Setup

1. **Seed the database with Cornell dorm data**

   ```bash
   npm run seed
   ```

2. **Test database connection**

   ```bash
   npm run test:connection
   ```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Dorms

- `GET /api/dorms` - Get all dorms (with filtering)
- `GET /api/dorms/:id` - Get specific dorm
- `POST /api/dorms` - Create dorm (admin only)
- `PUT /api/dorms/:id` - Update dorm (admin only)
- `DELETE /api/dorms/:id` - Delete dorm (admin only)
- `POST /api/dorms/:id/reviews` - Add dorm review

### Blog

- `GET /api/blogs` - Get blog posts (with filtering)
- `GET /api/blogs/:id` - Get specific blog post
- `POST /api/blogs` - Create blog post
- `PUT /api/blogs/:id` - Update blog post
- `DELETE /api/blogs/:id` - Delete blog post
- `POST /api/blogs/:id/like` - Like/unlike blog post
- `POST /api/blogs/:id/comments` - Add comment to blog post

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛠️ Development

### Available Scripts

#### Root Level (Workspace Management)

- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run seed` - Seed the database with Cornell dorm data
- `npm run test:connection` - Test MongoDB connection

#### Frontend Scripts (cd frontend/)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend Scripts (cd backend/)

- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `node seed-dorms.js` - Run database seeder
- `node test-connection.js` - Test database connection

## 🎨 Key Features Implementation

### State Management

- Redux Toolkit for centralized state management
- Separate slices for auth, dorms, blogs, and UI state
- Async thunks for API calls with loading states

### Responsive Design

- Mobile-first approach with responsive breakpoints
- Modern CSS Grid and Flexbox layouts
- Interactive components with hover effects and transitions

### Security

- Input validation on both client and server
- Password hashing with bcrypt
- Protected routes and role-based access control
- CORS configuration for secure cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Cornell University for the inspiration
- The React and Node.js communities for excellent documentation
- MongoDB for the robust database solution
