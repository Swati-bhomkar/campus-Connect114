# Campus Connect Pro - Backend Server

Backend API for Campus Connect Pro - a college-verified networking platform for students and alumni.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: bcryptjs for password hashing

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection config
│   │   └── studentDatabase.js # Student database for validation
│   ├── models/
│   │   └── User.js            # User schema
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── routes/
│   │   └── authRoutes.js      # Auth routes
│   └── index.js               # Server entry point
├── .env                       # Environment variables
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore rules
└── package.json               # Dependencies
```

## Setup & Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your MongoDB connection:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/campusconnect
```

### 3. Start MongoDB

Make sure MongoDB is running locally or update the `MONGO_URI` to your MongoDB instance.

### 4. Run the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register Student
**POST** `/api/auth/register`

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "registrationNumber": "223061",
  "password": "SecurePassword123",
  "collegEmail": "john.doe@college.edu",
  "passOutYear": 2025,
  "domain": "Software Engineering",
  "skills": ["React", "Node.js"]
}
```

Response (201):
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": "u_...",
    "name": "John Doe",
    "collegEmail": "john.doe@college.edu",
    "registrationNumber": "223061",
    "role": "student",
    "domain": "Software Engineering",
    "skills": ["React", "Node.js"],
    "currentStatus": "studying",
    "passOutYear": 2025,
    "reputationScore": 0,
    "referralCount": 0,
    "availableForReferrals": false,
    "joinedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

Error cases:
- **400**: Missing required fields
- **401**: "You are not authorized to register" - registration number/name not in database
- **409**: Email or registration number already registered

#### 2. Login User
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john.doe@college.edu",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "u_...",
    "name": "John Doe",
    "collegEmail": "john.doe@college.edu",
    "role": "student",
    ...
  }
}
```

Error cases:
- **400**: Missing email or password
- **401**: Invalid email or password

#### 3. Health Check
**GET** `/health`

Response (200):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Student Database Validation

The registration validates against a pre-uploaded student database.

Current student database sample:
- Registration Number: `223061` - ABHISHEK NIMBAL
- Registration Number: `223062` - AISHAWARYA PAYAPPANAVAR
- ... (and more)

Students must provide:
- **First Name**: Must match database exactly (case-insensitive)
- **Last Name**: Must match database exactly (case-insensitive)
- **Registration Number**: Must exist in database and match the name

## User Model

User document structure (MongoDB):

```javascript
{
  _id: ObjectId,
  id: String,                    // Unique identifier
  name: String,                  // Full name
  collegEmail: String,           // College email (unique)
  password: String,              // Hashed password
  registrationNumber: String,    // Student/Alumni reg number (unique)
  role: String,                  // "student", "alumni", "admin"
  domain: String,                // Career domain
  skills: [String],              // Technical skills
  currentStatus: String,         // "studying" or "working"
  passOutYear: Number,           // Year of graduation
  company: String,               // Optional: Current company
  companyVerified: String,       // "verified", "pending", "unverified"
  reputationScore: Number,       // User reputation (0-100)
  referralCount: Number,         // Total referrals given
  availableForReferrals: Boolean,// Can give referrals
  avatar: String,                // Avatar initials or URL
  bio: String,                   // Optional: User bio
  maxReferralsPerMonth: Number,  // Optional: Referral limit
  maxResumesPerDay: Number,      // Optional: Resume review limit
  joinedAt: String,              // ISO date string
  createdAt: Date,               // Timestamps
  updatedAt: Date
}
```

## Default Values on Registration

When a student registers:
- `role` = "student"
- `currentStatus` = "studying"
- `reputationScore` = 0
- `referralCount` = 0
- `availableForReferrals` = false
- `companyVerified` = "unverified"
- `joinedAt` = Current ISO date string

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `MONGO_URI` | `mongodb://localhost:27017/campusconnect` | MongoDB connection URI |

## Frontend Integration

The backend is designed to work seamlessly with the Campus Connect Pro frontend. 

### Integration Points

Frontend should:
1. Call `POST /api/auth/register` on student registration form submit
2. Call `POST /api/auth/login` on login form submit
3. Store returned user data in state/localStorage
4. Use user data to render dashboards (student, alumni, admin)

### Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "technical error details (dev only)"
}
```

## Database Seeding

To add test users to the database (after server is running):

```javascript
// Example using MongoDB client
const testUser = {
  name: "Test User",
  collegEmail: "test@college.edu",
  password: "hashedpassword",
  registrationNumber: "223061",
  role: "student",
  domain: "Software Engineering",
  skills: ["React", "Node.js"],
  currentStatus: "studying",
  passOutYear: 2025,
  companyVerified: "unverified",
  reputationScore: 0,
  referralCount: 0,
  availableForReferrals: false,
  avatar: "TU",
  joinedAt: new Date().toISOString()
};

// Insert via MongoDB shell or client
db.users.insertOne(testUser);
```

## Next Steps

Future enhancements:
- [ ] JWT token-based authentication
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Alumni registration and verification
- [ ] Admin authentication
- [ ] User profile update endpoints
- [ ] Referral creation endpoints
- [ ] Connection request endpoints
- [ ] Post creation endpoints
- [ ] Comprehensive logging and monitoring

## Troubleshooting

**MongoDB Connection Error**:
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env`

**Port Already in Use**:
- Change `PORT` in `.env` or kill process using port 5000

**Module Not Found**:
- Run `npm install` to ensure all dependencies are installed

## License

ISC
