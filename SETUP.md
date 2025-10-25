# 🚀 AIO Platform - Quick Start Guide

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

Get your MongoDB connection string:
- **MongoDB Atlas** (Cloud): Create account at https://www.mongodb.com/cloud/atlas
- **Local MongoDB**: Install from https://www.mongodb.com/try/download/community

### 3. Environment Configuration

Create `.env.local` in project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=aio
NEXTAUTH_SECRET=any_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

Replace:
- `username` and `password` with your MongoDB credentials
- `cluster.mongodb.net` with your MongoDB cluster URL

### 4. Add Test Users to MongoDB

Connect to your MongoDB and run these commands to add test users:

```javascript
// Add Admin User
db.users.insertOne({
  "email": "patrik@makeablesthlm.se",
  "password": "!",
  "name": "Manager User",
  "role": "admin",
  "clientId": null,
  "status": "active",
  "created_at": new Date(),
  "last_login": null
})

// Add Client User
db.users.insertOne({
  "email": "hartley@climber.se",
  "password": "!",
  "name": "Samantha",
  "role": "client",
  "clientId": "climber.se",
  "status": "active",
  "created_at": new Date(),
  "last_login": null
})
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Login credentials:**
- Admin: `patrik@makeablesthlm.se` / `!`
- Client: `hartley@climber.se` / `!`

---

## 🎯 Features Overview

### For Admins
- See all clients' data
- Manage LLM Queries for any client
- Manage Keywords for any client
- View all tracking data and brand mentions
- Create, edit, delete users

### For Clients
- View only your own data
- See your LLM Queries and Keywords
- Monitor your tracking results
- View brand mentions for your queries

---

## 📊 Sample Data Setup

Add sample queries and keywords to test:

```javascript
// Add a sample query
db.LLMQueries.insertOne({
  "query": "Vilket bolag är bäst på Microsoft Power BI-konsult i Sverige?",
  "custom_id": "climber.se",
  "created_at": new Date()
})

// Add a sample keyword
db.LLMKeywords.insertOne({
  "keyword": "climber.se",
  "custom_id": "climber.se",
  "type": "brand",
  "created_at": new Date()
})

// Add tracking data
db.LLMKeywordTracking.insertOne({
  "query": "Vilket bolag är bäst på Microsoft Power BI-konsult i Sverige?",
  "keyword": "climber.se",
  "found": true,
  "position": 1,
  "llm": "gpt-4o-search-preview",
  "custom_id": "climber.se",
  "date": new Date(),
  "url": "https://climber.se"
})

// Add brand mention
db.LLMBrandMentions.insertOne({
  "brand": "Climber AB",
  "query": "Vilket bolag är bäst på Microsoft Power BI-konsult i Sverige?",
  "url": "https://climber.se",
  "llm": "gpt-4o-search-preview",
  "position": 1,
  "is_competitor": false,
  "domain": "climber.se",
  "custom_id": "climber.se",
  "date": new Date()
})
```

---

## 🔧 Building for Production

```bash
npm run build
npm start
```

---

## 📝 Key Points

✅ **Simple Password Authentication**: Plain string comparison (as specified)
✅ **Role-based Access Control**: Admin sees all, Clients see only their data
✅ **HubSpot-like UI**: Clean, professional interface
✅ **MongoDB Integration**: All data persists in MongoDB
✅ **Responsive Design**: Works on desktop and mobile

---

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Check your connection string in `.env.local`
- Ensure MongoDB service is running
- Verify IP whitelist on MongoDB Atlas

**Build Errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Port Already in Use**
```bash
npm run dev -- -p 3001
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
