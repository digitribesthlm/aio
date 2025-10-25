# AIO - AI Optimization Platform

A Next.js application for tracking how client brands appear and rank in AI model responses (ChatGPT, Perplexity, Gemini, etc.).

## 🚀 Features

- **Admin Dashboard**: View all client data and manage the system
- **Client Dashboard**: View only your own tracking data and metrics
- **LLM Queries**: Manage prompts to monitor in AI models
- **Keywords**: Track brand names and competitor keywords
- **Tracking Data**: See when your keywords appear in AI responses
- **Brand Mentions**: Monitor all brands mentioned across AI responses
- **User Management**: Admin can create and manage users

## 📋 Prerequisites

- Node.js 16+
- MongoDB database (local or cloud)
- npm or yarn

## 🔧 Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables** in `.env.local`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_DB=aio
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Access the application**:
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Default Users

The app uses simple string password comparison. Add users in MongoDB:

**Admin User:**
```json
{
  "email": "patrik@makeablesthlm.se",
  "password": "!",
  "name": "Manager User",
  "role": "admin",
  "clientId": null,
  "status": "active"
}
```

**Client User:**
```json
{
  "email": "hartley@climber.se",
  "password": "!",
  "name": "Samantha",
  "role": "client",
  "clientId": "673381e25e38ffb2f5d5216b",
  "status": "active"
}
```

## 📊 Database Collections

The app uses 5 MongoDB collections:

### 1. **users**
- Authentication and user management
- Fields: email, password, name, role, clientId, status, created_at, last_login

### 2. **LLMQueries**
- Prompts to monitor in AI models
- Fields: query, custom_id, created_at

### 3. **LLMKeywords**
- Brand names and keywords to track
- Fields: keyword, custom_id, type (brand/competitor), created_at

### 4. **LLMKeywordTracking**
- Records when keywords appear in AI responses
- Fields: custom_id, query, keyword, found, position, llm, date, url

### 5. **LLMBrandMentions**
- All brands mentioned in AI responses
- Fields: custom_id, brand, query, url, llm, position, is_competitor, domain, date

## 🎯 User Roles

### Admin
- Access to all clients' data
- Can manage queries, keywords, tracking, mentions for all clients
- Can create and delete users
- Can view comprehensive analytics

### Client
- Only sees their own data (filtered by clientId)
- Can view their queries, tracking results, and brand mentions
- Cannot access other clients' data

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - Login with email and password

### Queries
- `GET /api/queries` - Get queries (filtered by role)
- `POST /api/queries` - Create new query
- `DELETE /api/queries/[id]` - Delete query

### Keywords
- `GET /api/keywords` - Get keywords (filtered by role)
- `POST /api/keywords` - Create new keyword
- `DELETE /api/keywords/[id]` - Delete keyword

### Tracking
- `GET /api/tracking` - Get tracking data (filtered by role)

### Mentions
- `GET /api/mentions` - Get brand mentions (filtered by role)

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users/[id]` - Delete user

### Stats
- `GET /api/stats` - Get dashboard statistics (filtered by role)

## 🎨 UI Features

- **HubSpot-like Layout**: Clean sidebar navigation with responsive design
- **Role-based Navigation**: Different menu items for admin vs client
- **Stats Cards**: Quick overview of key metrics
- **Data Tables**: Sortable and filterable data views
- **Badges**: Status indicators for data types
- **Modern Design**: Professional color scheme with smooth transitions

## 🔐 Security Notes

- Passwords are stored as plain text (as per specification)
- Session storage is used for client-side user sessions
- Always use HTTPS in production
- Implement proper authentication middleware for API endpoints in production

## 📝 Development

Build for production:
```bash
npm run build
npm start
```

## 📄 License

Private project

## 🤝 Support

Contact: patrik@makeablesthlm.se
