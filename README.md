# ReWear - Community Clothing Exchange Platform

A full-stack React and Node.js application for community clothing exchange, now optimized for Vercel deployment with serverless functions.

## 🌟 Features

### Core Functionality
- **User Authentication**: Email/password signup and login with JWT tokens
- **Landing Page**: Platform introduction with calls-to-action and featured items carousel
- **User Dashboard**: Profile details, points balance, uploaded items overview, and swap history
- **Item Management**: Upload, browse, and manage clothing items with images
- **Swap System**: Direct item swaps or point-based redemption
- **Admin Panel**: Moderate and approve/reject item listings

### Key Highlights
- **Sustainable Focus**: Promotes textile waste reduction and sustainable fashion
- **Dual Exchange Methods**: Both direct swaps and points-based system
- **Community-Driven**: User-to-user clothing exchange platform
- **Admin Moderation**: Quality control through admin approval system
- **Responsive Design**: Modern, mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - uses mock data in development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohittttt7/ggg.git
   cd ggg
   ```

2. **Install server dependencies**
   ```powershell
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```powershell
   cd ../client
   npm install
   ```

4. **Set up environment variables** (optional in dev)
   - The server uses sensible defaults in development:
     - `PORT=5000`
     - `JWT_SECRET=devsecret`
     - `MONGODB_URI` defaults to `mongodb://localhost:27017/rewear`
   - To customize, create `server/.env` with your values.

5. **Start the development servers**

   **Terminal 1 - Backend:**
   ```powershell
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```powershell
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🚀 Vercel Deployment

This application is now configured for seamless deployment on Vercel with serverless functions.

### Deploy to Vercel

#### Option 1: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration and deploy

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel
```

### Environment Variables for Vercel

Set these in your Vercel dashboard:
- `JWT_SECRET`: Your JWT secret key (default: "devsecret")
- `MONGODB_URI`: Optional MongoDB connection string

### Vercel Project Structure

```
/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   │   ├── login.js       # POST /api/auth/login
│   │   └── register.js    # POST /api/auth/register
│   ├── items/
│   │   ├── index.js       # GET/POST /api/items
│   │   ├── [id].js        # GET /api/items/:id
│   │   └── my-items.js    # GET /api/items/my-items
│   └── users/
│       └── profile.js     # GET /api/users/profile
├── client/                # React frontend
├── server/               # Original Express server (dev only)
└── vercel.json          # Vercel configuration
```

## 🧪 Demo Credentials

The platform includes sample data for testing:

- **Demo User**: demo@rewear.com / password123
- **Admin User**: admin@rewear.com / password123

## 📁 Project Structure

```
ggg/
├── client/                 # React.js Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts (Auth)
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── uploads/           # File uploads
│   ├── package.json
│   └── index.js
└── README.md
```

## 🛠 Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all approved items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item (authenticated)
- `GET /api/items/user/my-items` - Get user's items (authenticated)

### Admin
- `GET /api/items/admin/pending` - Get pending items (admin)
- `PATCH /api/items/admin/:id/status` - Approve/reject item (admin)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PATCH /api/users/profile` - Update profile (authenticated)

## 🎨 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/dfa2f7eb-246a-4da9-b6a8-9c1518fb9b26)

### User Registration
![Registration Page](https://github.com/user-attachments/assets/4011b7ff-0ef6-4f53-89bc-4d96d550816e)

### User Dashboard
![Dashboard](https://github.com/user-attachments/assets/8b879cfb-35fd-4a7f-831a-53bb8bacff56)

## 🔐 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/rewear
JWT_SECRET=your_jwt_secret_here_make_it_long_and_secure
PORT=5000
```

## 🚧 Development Mode

In development mode without MongoDB, the application uses mock data including:
- Sample users (demo and admin accounts)
- Sample clothing items with different categories
- Mock authentication and data persistence

## 📋 Features Roadmap

### Completed ✅
- User authentication system
- Landing page with featured items
- User dashboard
- Item browsing and display
- Mock data system for development
- Responsive design
- Admin role structure

### Coming Soon 🔄
- Complete item upload functionality
- Swap request system
- Points management
- Admin panel features
- Real-time notifications
- Search and filtering
- User profiles and ratings
- Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌱 About Sustainability

ReWear promotes sustainable fashion by:
- Reducing textile waste through item reuse
- Building a community around conscious consumption
- Providing alternatives to fast fashion
- Encouraging clothing longevity through swapping

---

**Made with 💚 for sustainable fashion**