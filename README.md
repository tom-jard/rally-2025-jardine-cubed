# 🎮 Play'd - Turning Playtime into Paytime

**A revolutionary financial gaming platform that rewards users with game currency for completing real-world financial actions.**

![Play'd Demo](https://img.shields.io/badge/Status-Hackathon%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Plaid-blue)

## 🎯 Live Demo

- **Frontend**: Deploy to Vercel from `playd-frontend-base44/`
- **Backend**: Deploy to Vercel from `server/`

## ✨ Key Features

### 🏦 **Real Banking Integration**
- **Plaid Link** - Connect real bank accounts safely
- **First Platypus Bank** - Custom banking partner with cute branding
- **Account Recommendations** - Earn darumas for opening new account types
- **Sandbox Environment** - Safe for demos and development

### 🌱 **Habit Building**
- **Touch Grass Challenge** - AI-powered photo analysis
- **Daily Actions** - Build healthy financial habits
- **Real-Time Rewards** - Instant daruma updates

### 🧠 **Educational Gaming**
- **Financial Literacy Quiz** - Learn while earning
- **History Quiz** - Educational content with rewards
- **Interactive Learning** - Multiple choice with explanations

### 🍎 **Health Integration**
- **Apple Health** - Exercise and sleep tracking
- **Fitness Challenges** - 7-day streaks and goals
- **Wellness Rewards** - Darumas for healthy habits

## 🛠 Tech Stack

### Frontend (`playd-frontend-base44/`)
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** for components
- **React Router** for navigation

### Backend (`server/`)
- **Express.js** REST API
- **Plaid SDK** for banking integration
- **In-memory database** with realistic mock data
- **CORS enabled** for cross-origin requests

## 🚀 Quick Start

### Local Development

1. **Start Backend**
   ```bash
   cd server
   npm install
   node index.js
   ```

2. **Start Frontend**
   ```bash
   cd playd-frontend-base44
   npm install
   npm run dev
   ```

3. **Open App**
   - Frontend: http://localhost:3003
   - Backend: http://localhost:3001

### Demo Credentials

**Plaid Sandbox (First Platypus Bank)**
- Username: `user_good`
- Password: `pass_good`

## 🎪 Hackathon Demo Flow

### 1. Landing Page (30s)
- Show beautiful "Play'd" branding
- Navigate to Earn tab

### 2. Core Features (2-3 minutes)
- **Touch Grass** - Upload outdoor photo, see AI analysis
- **First Platypus Bank** - Real Plaid integration, account recommendations
- **Self-Learning** - Take financial literacy quiz
- **Apple Health** - Fitness tracking simulation

### 3. Real-Time Updates (30s)
- Show daruma balance increasing
- Demonstrate cross-platform integration

## 🔧 Deployment

### Deploy to Vercel

**Backend:**
```bash
cd server && vercel --prod
```

**Frontend:**
```bash
cd playd-frontend-base44 && vercel --prod
```

## 🏆 Key Demo Points for Judges

- ✅ **Real Banking Integration** - Actual Plaid API with sandbox
- ✅ **AI-Powered Features** - Photo analysis for habit tracking
- ✅ **Gamification** - Daruma rewards for financial actions
- ✅ **Modern Tech Stack** - React, Node.js, real-time updates
- ✅ **Professional UI** - Glassmorphism, animations, mobile-responsive

---

**Ready to turn playtime into paytime?** 🦫💰✨