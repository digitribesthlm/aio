# ⚡ Quick Reference Guide

## 🚀 Getting Started (60 seconds)

```bash
# 1. Install
npm install

# 2. Create .env.local
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DB=aio" > .env.local

# 3. Add users to MongoDB (see SETUP.md)

# 4. Run
npm run dev

# 5. Go to http://localhost:3000
```

---

## 📍 File Locations

| What | Where |
|------|-------|
| Login form | `app/page.js` |
| Dashboard layout | `app/dashboard/layout.js` |
| API endpoints | `app/api/*/route.js` |
| MongoDB connection | `lib/mongodb.js` |
| Auth logic | `lib/auth.js` |
| Styles | `app/globals.css` |
| Environment vars | `.env.local` |

---

## 🔄 Common Tasks

### Add a New Page
```bash
# Create folder
mkdir -p app/dashboard/newpage

# Create page.js with:
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPage() {
  // Your code here
}
```

### Add a New API Endpoint
```bash
# Create folder and file
mkdir -p app/api/newapi
cat > app/api/newapi/route.js << 'EOF'
export async function GET(request) {
  // Your code here
}
EOF
```

### Query Database
```javascript
import { getDatabase } from '@/lib/mongodb';

const db = await getDatabase();
const data = await db.collection('LLMQueries').find({}).toArray();
```

---

## 🔐 User Authentication

**String Password Comparison:**
```javascript
if (user.password === password) {
  // Login success
}
```

**Session Storage:**
```javascript
// Store
sessionStorage.setItem('user', JSON.stringify(userData));

// Get
const user = JSON.parse(sessionStorage.getItem('user'));

// Clear
sessionStorage.removeItem('user');
```

---

## 🎯 Role-Based Filtering

**Admin** → All data
```javascript
const filter = {};
```

**Client** → Only own data
```javascript
const filter = { custom_id: clientId };
```

---

## 📊 API Response Format

All endpoints return JSON:
```javascript
// Success
{ success: true, data: {...} }

// Error
{ error: "Error message", status: 400 }
```

---

## 🧩 Key Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `custom_id` | String | Client identifier (filter key) |
| `clientId` | String | User's associated client |
| `role` | String | "admin" or "client" |
| `isAdmin` | Boolean | Admin permission check |

---

## 🔗 API Endpoints

### Login
```
POST /api/login
{ email, password } → { user }
```

### Queries
```
GET /api/queries?isAdmin=true&clientId=xxx
POST /api/queries { query, custom_id }
DELETE /api/queries/[id]
```

### Keywords
```
GET /api/keywords?isAdmin=true&clientId=xxx
POST /api/keywords { keyword, custom_id, type }
DELETE /api/keywords/[id]
```

### Tracking
```
GET /api/tracking?isAdmin=true&clientId=xxx
```

### Mentions
```
GET /api/mentions?isAdmin=true&clientId=xxx
```

### Users (Admin only)
```
GET /api/users
POST /api/users { email, password, name, role, clientId }
DELETE /api/users/[id]
```

### Stats
```
GET /api/stats?isAdmin=true&clientId=xxx
```

---

## 🎨 CSS Classes

```css
.navbar              /* Top bar */
.sidebar             /* Left navigation */
.sidebar-item.active /* Active menu item */
.card                /* Content box */
.stats-grid          /* Stats container */
.stat-card           /* Individual stat */
.table-container     /* Table wrapper */
.badge               /* Status badge */
.badge-admin         /* Admin badge */
.badge-client        /* Client badge */
.badge-active        /* Active status */
.btn                 /* Primary button */
.error               /* Error text */
```

---

## 🚨 Common Errors

| Error | Fix |
|-------|-----|
| MongoDB connection failed | Check `.env.local` MONGODB_URI |
| User not found | Add user to MongoDB first |
| `localStorage is not defined` | Use `sessionStorage` (client-side) |
| CORS error | Should not happen - same domain |
| 404 on API | Check route file location |

---

## 🧪 Testing

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clear cache
rm -rf .next
```

---

## 📱 Responsive Breakpoints

- Mobile: < 768px (sidebar collapses - not implemented)
- Tablet: 768px - 1024px (sidebar collapses - not implemented)
- Desktop: > 1024px (full layout)

---

## 🔑 Key Imports

```javascript
// Frontend
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Backend
import { getDatabase } from '@/lib/mongodb';
import { verifyUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Components
'use client';  // For client components
```

---

## 💡 Pro Tips

1. **Always check user role** before showing data
2. **Use `custom_id` filter** for clients to prevent data leaks
3. **Store passwords as-is** (plain text) - as specified
4. **Remove passwords** from API responses
5. **Check `isAdmin`** param to determine filtering
6. **Use ObjectId** for MongoDB _id queries
7. **Test both roles** when developing
8. **Check browser console** for frontend errors
9. **Check server logs** for backend errors
10. **Rebuild if files don't load** - `rm -rf .next && npm run build`

---

## 📚 File Structure Tree

```
AIO Platform
├── Pages (UI)
│   ├── Login
│   ├── Dashboard
│   │   ├── Overview
│   │   ├── Queries
│   │   ├── Keywords
│   │   ├── Tracking
│   │   ├── Mentions
│   │   └── Users (admin)
│
├── APIs (Backend)
│   ├── /auth (login)
│   ├── /queries (CRUD)
│   ├── /keywords (CRUD)
│   ├── /tracking (read)
│   ├── /mentions (read)
│   ├── /users (CRUD admin)
│   └── /stats (read)
│
├── Database
│   ├── users
│   ├── LLMQueries
│   ├── LLMKeywords
│   ├── LLMKeywordTracking
│   └── LLMBrandMentions
│
└── Utils
    ├── MongoDB connection
    └── Auth helper
```

---

## ✅ Checklist for New Developer

- [ ] Read `README.md`
- [ ] Follow `SETUP.md`
- [ ] Understand role-based filtering
- [ ] Know the 5 database collections
- [ ] Test login with both roles
- [ ] Try CRUD operations
- [ ] Check browser DevTools
- [ ] Review `PROJECT_SUMMARY.md`
- [ ] Understand `custom_id` filtering
- [ ] Know where error logs are

---

**Need help?** Check the relevant `.md` file in the project root.
