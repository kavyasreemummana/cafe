# Cafe Backend API

A robust backend API for the Cafe application built with Express.js and MongoDB.

## Features

- **Menu Management**: CRUD operations for menu items with categories, pricing, and availability
- **Order Management**: Complete order lifecycle from creation to completion
- **User Management**: User registration, authentication, and profile management
- **Security**: JWT authentication, password hashing, rate limiting, and CORS protection
- **Data Validation**: Comprehensive input validation and error handling
- **Pagination**: Efficient data retrieval with pagination support
- **Search & Filtering**: Advanced search and filtering capabilities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: Mongoose schema validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cafe
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_secure_jwt_secret_here
   ```

4. **MongoDB Atlas Connection:**
   - The application is configured to use MongoDB Atlas
   - Connection string is already set in env.example
   - Database name: `cafe`
   - Cluster: `cluster0.jupnuhk.mongodb.net`

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Menu Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items with filtering and pagination |
| GET | `/api/menu/categories` | Get all available categories |
| GET | `/api/menu/featured` | Get featured menu items |
| GET | `/api/menu/:id` | Get a specific menu item |
| POST | `/api/menu` | Create a new menu item (Admin) |
| PUT | `/api/menu/:id` | Update a menu item (Admin) |
| DELETE | `/api/menu/:id` | Delete a menu item (Admin) |
| PATCH | `/api/menu/:id/availability` | Toggle item availability (Admin) |

### Order Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders with filtering (Admin/Staff) |
| GET | `/api/orders/customer/:email` | Get orders for a specific customer |
| GET | `/api/orders/:id` | Get a specific order |
| POST | `/api/orders` | Create a new order |
| PATCH | `/api/orders/:id/status` | Update order status (Admin/Staff) |
| PATCH | `/api/orders/:id/payment` | Update payment status |
| DELETE | `/api/orders/:id` | Cancel an order |
| GET | `/api/orders/stats/summary` | Get order statistics (Admin) |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | User registration |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile` | Get user profile (Protected) |
| PUT | `/api/users/profile` | Update user profile (Protected) |
| PUT | `/api/users/password` | Change password (Protected) |
| GET | `/api/users` | Get all users (Admin) |
| PATCH | `/api/users/:id/status` | Toggle user status (Admin) |
| GET | `/api/users/stats/summary` | Get user statistics (Admin) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## Query Parameters

### Menu Items
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `search`: Text search in name and description
- `minPrice`/`maxPrice`: Price range filtering
- `available`: Filter by availability (true/false)
- `featured`: Filter featured items (true/false)
- `sortBy`: Sort field (name, price, createdAt)
- `sortOrder`: Sort direction (asc/desc)

### Orders
- `page`: Page number (default: 1)
- `limit`: Orders per page (default: 20)
- `status`: Filter by order status
- `orderType`: Filter by order type (dine-in/takeaway/delivery)
- `paymentStatus`: Filter by payment status
- `startDate`/`endDate`: Date range filtering
- `customerEmail`: Filter by customer email
- `sortBy`: Sort field (createdAt, total, status)
- `sortOrder`: Sort direction (asc/desc)

### Users
- `page`: Page number (default: 1)
- `limit`: Users per page (default: 20)
- `role`: Filter by user role
- `isActive`: Filter by active status (true/false)
- `search`: Text search in name, email, and phone
- `sortBy`: Sort field (name, email, createdAt)
- `sortOrder`: Sort direction (asc/desc)

## Data Models

### MenuItem
- Basic info: name, description, price, image, category
- Availability: isAvailable, preparationTime
- Dietary: allergens, nutritionalInfo
- Metadata: tags, featured, timestamps

### Order
- Customer info: name, email, phone
- Order details: items, status, orderType
- Financial: subtotal, tax, deliveryFee, total
- Payment: method, status
- Metadata: specialRequests, notes, timestamps

### User
- Basic info: name, email, password, phone
- Profile: address, preferences, loyaltyPoints
- Security: role, isActive, verification status
- Authentication: login attempts, account locking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get JWT token
2. **Protected Routes**: Include token in Authorization header
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info included in response headers

## CORS Configuration

- **Origin**: Configurable via FRONTEND_URL environment variable
- **Credentials**: Supported for authenticated requests

## Development

### Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run seed`: Seed database with sample data

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT signing

## Database Seeding

The seeder script creates:
- 10 sample menu items across different categories
- 1 admin user (admin@cafe.com / admin123)

Run with:
```bash
npm run seed
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Mongoose schema validation
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers

## Production Considerations

1. **Environment Variables**: Use strong JWT_SECRET
2. **MongoDB**: Use MongoDB Atlas or secure local instance
3. **HTTPS**: Enable SSL/TLS in production
4. **Logging**: Implement proper logging system
5. **Monitoring**: Add health checks and monitoring
6. **Backup**: Regular database backups

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in .env
   - Ensure network access

2. **Port Already in Use**
   - Change PORT in .env
   - Kill existing process on port

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Review data types

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## Contributing

1. Follow existing code style
2. Add proper error handling
3. Include input validation
4. Write clear documentation
5. Test API endpoints

## License

This project is licensed under the ISC License.
