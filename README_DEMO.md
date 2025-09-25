# Play'd Marketplace Demo

## Quick Start

### 1. Start the Backend Server

```bash
cd playd-backend
npm install
npm start
```

Backend will run on http://localhost:5000

### 2. Run the iOS App

Open `PlaydApp` folder in Xcode:
1. Open Xcode
2. Open the PlaydApp folder as a Swift project
3. Select iPhone simulator (iPhone 15 Pro recommended)
4. Press ⌘+R to build and run

**Note**: The app uses mock Game Center authentication for demo purposes.

## Architecture

### Backend (Node.js + Express)
- SQLite in-memory database (no setup required)
- JWT authentication
- RESTful API endpoints for:
  - Game Center authentication
  - Coin management
  - Challenge completion
  - Game currency redemption
  - Daily streak bonuses

### iOS App (SwiftUI)
- Game Center integration (mocked for demo)
- Two-tab interface:
  - **Games Tab**: Redeem Play'd Coins for in-game currency
  - **Earn Tab**: Complete challenges to earn coins
- Real-time balance updates
- Animated UI inspired by Mistplay and Apple Fitness

## Demo Flow

1. **Launch**: App authenticates with mock Game Center
2. **Daily Streak**: Claim 120 bonus coins
3. **Earn Tab**: Complete challenges from partners:
   - SoFi (Financial tasks)
   - Fitbit (Health goals)
   - Coursera (Learning modules)
4. **Games Tab**: Redeem coins for:
   - Monopoly GO dice rolls
   - Madden Mobile cash
   - Candy Crush gold bars
5. **Live Updates**: Watch balance change in real-time

## Key Features

- **Universal Currency**: Play'd Coins work across all games
- **Partner Integrations**: Mock connections to SoFi, Fitbit, Coursera
- **Game Linking**: Automatic via Game Center teamPlayerID
- **Value Transparency**: Shows dollar equivalents
- **Progress Tracking**: Daily goals and streaks

## Testing the Demo

### Complete a Challenge:
1. Go to Earn tab
2. Expand "Finance" category
3. Tap "Start Challenge" on any SoFi task
4. Watch coins get added to balance

### Redeem for Game Currency:
1. Go to Games tab
2. Select amount using +/- buttons
3. Tap "Redeem"
4. Coins are converted to game currency

### Daily Streak:
1. Games tab shows streak bonus
2. Tap "Claim 120 ⭐"
3. Coins added instantly

## API Endpoints

- `POST /api/auth/gamecenter` - Authenticate with Game Center ID
- `GET /api/coins/balance` - Get current coin balance
- `GET /api/games` - List available games
- `GET /api/challenges` - List partner challenges
- `POST /api/actions/complete` - Complete challenge, earn coins
- `POST /api/redeem` - Redeem coins for game currency
- `POST /api/streak/claim` - Claim daily streak bonus

## The Vision

Play'd transforms mobile gaming from wealth extraction to wealth building. Instead of spending money on virtual items, users earn game currency through positive real-world actions.

**"Get Play'd for Living Better"** 🎮💰