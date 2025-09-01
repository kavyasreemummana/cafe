# Login Functionality Setup Guide

## Overview
This guide explains how to set up and use the login functionality that has been added to your cafe application. The system includes user registration, login, profile management, and secure authentication.

## Features Added

### 1. Authentication Components
- **Login Component** (`src/components/Login.jsx`) - Handles user login and registration
- **UserProfile Component** (`src/components/UserProfile.jsx`) - Manages user profile and settings
- **AuthContext** (`src/contexts/AuthContext.jsx`) - Manages authentication state across the app

### 2. Backend Integration
- **User Routes** - Registration, login, profile management endpoints
- **JWT Authentication** - Secure token-based authentication
- **User Model** - Comprehensive user data structure with preferences

### 3. Frontend Features
- **Header Integration** - Login/Register buttons and user profile access
- **Modal Forms** - Beautiful, responsive login and profile forms
- **State Management** - Persistent authentication state

## Setup Instructions

### Backend Setup

1. **Environment Variables**
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp env.example .env
   ```

2. **Install Dependencies** (if not already installed)
   ```bash
   cd server
   npm install
   ```

3. **Start Backend Server**
   ```bash
   npm start
   # or use the batch file
   start-backend.bat
   ```

### Frontend Setup

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

## How to Use

### 1. User Registration
1. Click "Sign Up" in the header
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Phone Number
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create Account"

### 2. User Login
1. Click "Sign In" in the header
2. Enter your email and password
3. Click "Sign In"

### 3. Profile Management
1. After logging in, click on your name in the header
2. View your profile information
3. Edit profile details:
   - Personal information
   - Address
   - Dietary preferences
   - Spice level preferences
4. Change password in the Security tab

### 4. Logout
1. Open your profile
2. Click the "Logout" button at the bottom

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Change password (protected)

### User Data Structure
```javascript
{
  name: "User Name",
  email: "user@example.com",
  phone: "1234567890",
  role: "customer", // customer, staff, admin
  profile: {
    address: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zipCode: "12345",
      country: "India"
    },
    preferences: {
      dietaryRestrictions: ["Vegetarian", "Gluten-Free"],
      spiceLevel: "Medium"
    },
    loyaltyPoints: 150,
    loyaltyTier: "Bronze" // New, Bronze, Silver, Gold
  }
}
```

## Security Features

### 1. Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Minimum password length: 6 characters
- Password confirmation required for registration

### 2. Account Protection
- Account lockout after 5 failed login attempts
- 2-hour lockout period
- Login attempt tracking

### 3. JWT Authentication
- Secure token-based authentication
- 7-day token expiration
- Automatic token storage in localStorage

## Styling and Responsiveness

### 1. Design Features
- Modern, coffee-themed design
- Smooth animations and transitions
- Responsive layout for all devices
- Dark mode support

### 2. CSS Classes
- `.login-overlay` - Modal backdrop
- `.login-modal` - Login/Register form container
- `.profile-overlay` - Profile modal backdrop
- `.profile-modal` - Profile management container

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure MongoDB is running
   - Check environment variables
   - Verify server is running on port 5000

2. **Authentication Errors**
   - Clear browser localStorage
   - Check JWT_SECRET in backend .env
   - Verify user credentials

3. **CORS Issues**
   - Ensure FRONTEND_URL is set correctly in backend .env
   - Check that frontend is running on the expected port

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your backend `.env` file.

## Future Enhancements

### Potential Additions
- Email verification
- Password reset functionality
- Social media login
- Two-factor authentication
- User roles and permissions
- Order history integration
- Loyalty program features

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure both frontend and backend are running
4. Check MongoDB connection status

## Files Modified/Created

### New Files
- `src/components/Login.jsx`
- `src/components/Login.css`
- `src/components/UserProfile.jsx`
- `src/components/UserProfile.css`
- `LOGIN_SETUP.md`

### Modified Files
- `src/App.jsx` - Added AuthProvider wrapper
- `src/components/Header.jsx` - Added authentication buttons
- `src/App.css` - Added header authentication styles

### Existing Files (No Changes)
- `src/contexts/AuthContext.jsx` - Already implemented
- `src/services/api.js` - Already implemented
- `server/routes/users.js` - Already implemented
- `server/models/User.js` - Already implemented

The login functionality is now fully integrated and ready to use!
