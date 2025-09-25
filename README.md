# Playd - Converted from Base44

A modern React application that gamifies real-world tasks and habits. Users earn "darumas" by completing tasks and can redeem them for in-game rewards.

## 🚀 Features

- **Task Management**: Complete real-world tasks to earn darumas
- **Game Rewards**: Redeem darumas for in-game currency and items
- **Integrations**: Mock integrations with SoFi, Apple Health, and Claude AI
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Works on desktop and mobile devices
- **Animated Interface**: Smooth animations with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript/JavaScript
- **Styling**: Tailwind CSS, Radix UI
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd playd-frontend-converted
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your project
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

### Environment Variables for Production
In your Vercel dashboard, add these environment variables:
- `VITE_API_URL`: Your production API URL
- `VITE_APP_NAME`: Playd
- `VITE_ENABLE_MOCK_DATA`: true (for demo mode)

## 🏗️ Project Structure

```
src/
├── api/                    # API clients and mock data
│   ├── apiClient.js       # Axios client configuration
│   ├── entities.js        # Data entities (Task, User, GameReward)
│   ├── functions.js       # API functions (Plaid, analytics, etc.)
│   ├── integrations.js    # Integration functions (LLM, file upload)
│   └── mockEntities.js    # Mock implementations
├── components/            # Reusable components
│   ├── earn/             # Earn page components
│   ├── integrations/     # Integration components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   └── PlayerHeader.jsx  # User info header
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── pages/                # Page components
│   ├── Earn.jsx         # Tasks and earning page
│   ├── Games.jsx        # Rewards redemption page
│   ├── Home.jsx         # Landing page
│   ├── Layout.jsx       # App layout wrapper
│   └── index.jsx        # Routing configuration
├── utils/               # Utility functions
├── App.jsx             # Main app component
└── main.jsx           # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎮 How It Works

### Earning Darumas
1. **Action of the Day**: Upload a photo of being outdoors
2. **App Integrations**: Complete tasks through connected apps:
   - SoFi: Banking and investment tasks
   - Apple Health: Fitness and wellness goals
   - Claude: AI-assisted learning and journaling

### Redeeming Rewards
- Browse available game rewards
- Spend darumas on in-game currency
- Rewards for popular games like Candy Crush, Clash of Clans, Roblox

## 🔄 Conversion from Base44

This project was converted from Base44 to regular React code:

### What was changed:
- ✅ Removed `@base44/sdk` dependency
- ✅ Replaced Base44 entities with mock implementations
- ✅ Created custom API client with Axios
- ✅ Replaced Base44 functions with mock functions
- ✅ Updated package.json for standard React deployment
- ✅ Added Vercel configuration
- ✅ Implemented custom groupBy function (removed lodash dependency)

### Mock Implementations:
- **User Management**: Mock user data with local state
- **Task System**: Predefined tasks with mock completion logic
- **Integrations**: Simulated responses for SoFi, Apple Health, Claude
- **File Upload**: Mock file upload with placeholder URLs
- **LLM Integration**: Mock AI responses for photo analysis

## 🚨 Important Notes

- This is currently running in **demo mode** with mock data
- Real integrations would require:
  - Backend API server
  - Plaid API keys for banking integration
  - Apple HealthKit integration (iOS only)
  - OpenAI/Claude API keys for AI features
  - Proper authentication system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Ready to deploy to Vercel!** 🚀

The app is now fully converted from Base44 and ready for standard React development and deployment.