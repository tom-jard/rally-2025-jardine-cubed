# Play'd iOS App Specification

## App Overview
**Name**: Play'd - Earn Rewards for Living Better
**Purpose**: iOS marketplace app where users earn Play'd Coins through real-world actions and redeem them for in-game currency
**Target Users**: Mobile gamers (especially Gen Z) who want rewards for positive life choices
**Tagline**: "Get Play'd for Living Better"

## Core Value Proposition
Transform mobile gaming from wealth extraction to wealth building. Users earn Play'd Coins through fitness, learning, and financial actions, then redeem them for premium currency in their favorite games.

## Authentication & Identity

### Game Center Integration
```swift
// Primary authentication method
import GameKit

func authenticatePlayer() {
    GKLocalPlayer.local.authenticateHandler = { viewController, error in
        if let viewController = viewController {
            // Present Game Center login
            present(viewController, animated: true)
        } else if GKLocalPlayer.local.isAuthenticated {
            // Store universal player ID
            let teamPlayerID = GKLocalPlayer.local.teamPlayerID
            UserDefaults.standard.set(teamPlayerID, forKey: "playd_user_id")
        }
    }
}
```

### Why Game Center?
- **Universal Identity**: `teamPlayerID` works across all iOS games
- **Privacy Preserved**: Apple handles real identity, apps get anonymized ID
- **Automatic Linking**: Same ID in Play'd and partner games = instant account connection
- **Native Trust**: Games already integrate Game Center

### Sign in with Apple (Fallback)
- For users who don't use Game Center
- Required for App Store approval
- Provides additional identity verification

## App Architecture

### Tab Structure
```swift
UITabBarController with two main tabs:
1. GamesViewController (Collection View)
2. EarnViewController (Grouped Table View)
```

### Tab 1: Games (Based on Mistplay + Apple Games)
**Purpose**: Redeem Play'd Coins for in-game currency

**Visual Design** (Inspired by Screenshots):
- **Profile Header**: Avatar + username + currency counters (like Mistplay)
- **Daily Streak Section**: Bonus coin claiming (Apple Fitness style)
- **Games Collection**: Card-based layout with rich visuals
- **Purple-to-teal gradients** for gaming aesthetic
- **Dark theme** with premium polish

**Enhanced Game Card Layout**:
```
Profile: [Avatar] User123         [💰 1,250 Play'd Coins]

🔥 Daily Streak Bonus             [Claim 120 ⭐]

Games You'll Love
┌─────────────────────────────────┐
│  [Monopoly GO Icon] 🎲          │
│  Monopoly GO                    │
│  120 Coins = 1 Dice Roll        │
│  Connected ✅ [$1.00 value]     │
│  [Redeem 600 → 5 Rolls]        │
└─────────────────────────────────┘
```

**Core Features** (Enhanced):
- **Streak System**: Daily login bonuses for earning coins
- **Connection Status**: Visual indicators with Game Center linking
- **Bulk Redemption**: Redeem multiple units at once
- **Value Transparency**: Clear dollar equivalents
- **Recent Activity**: Show last redemption/earning actions

### Tab 2: Earn (Based on Apple Fitness Awards)
**Purpose**: Complete partner actions to earn Play'd Coins

**Visual Design** (Inspired by Apple Fitness Screenshots):
- **Dark theme** with rich card layouts and metallic badges
- **Progress tracking** with completion ratios (like "1,098 of 1,250")
- **Category grouping** with expandable sections
- **3D achievement styling** for completed challenges
- **"Show All" patterns** for content management

**Enhanced UI Layout**:
```
Your Progress Today: 240 of 500 coins earned

🏆 Monthly Challenges          [Show All]
┌─────────────────────────────────┐
│  [3D Golden Badge]              │
│  September Financial Challenge  │
│  Complete 3 more SoFi tasks     │
│  Progress: 2/5 • 1,200 coins   │
└─────────────────────────────────┘
```

**Category Structure**:

#### Financial Partners
```
🏦 FINANCE
┌─────────────────────────────────┐
│  [SoFi Logo]                    │
│  Complete Financial Checkup     │
│  Earn 500 Play'd Coins         │
│  [Start Challenge]              │
└─────────────────────────────────┘
```

#### Health Partners
```
🏃 FITNESS
┌─────────────────────────────────┐
│  [Fitbit Logo]                  │
│  Complete Daily Step Goal       │
│  Earn 100 Play'd Coins         │
│  Progress: 6,247 / 10,000 steps │
│  [Open Fitbit]                  │
└─────────────────────────────────┘
```

#### Learning Partners
```
🎓 LEARNING
┌─────────────────────────────────┐
│  [Coursera Logo]                │
│  Finish "Budgeting Basics"      │
│  Earn 300 Play'd Coins         │
│  Progress: Lesson 2 of 5        │
│  [Continue Course]              │
└─────────────────────────────────┘
```

## UI/UX Benchmarks & Visual References

### Apple Fitness Awards (Primary Earn Tab Reference)
**Visual Elements from Screenshots:**
- **Dark theme** with rich card layouts and subtle gradients
- **Achievement cards** with metallic/3D badge styling and progress ratios
- **Progress indicators**: "1,098 of 1,250" completion display
- **Category sections**: "Monthly Challenges", "Fitness+ Workouts" with expandable design
- **"Show All" pattern** for managing content overflow
- **Premium polish** with smooth animations and native iOS feel

**Apply to Play'd Earn Tab:**
```
🏦 FINANCIAL WELLNESS
┌─────────────────────────────────┐
│  [SoFi Badge] Complete Checkup  │
│  Progress: 3 of 5 steps         │
│  Earn 500 Play'd Coins         │
│  [Show All] [Start Challenge]   │
└─────────────────────────────────┘
```

### Mistplay Gaming Platform (Primary Games Tab Reference)
**Visual Elements from Screenshots:**
- **Profile header** with avatar, username, and stats display
- **Currency counters** in top-right (gems: 0, trophies: 0)
- **Daily streak bonus** with prominent "Claim 10" button
- **Purple-to-teal gradient** backgrounds for gaming aesthetic
- **Bottom tab navigation**: Home, Surveys, Tournaments, Shop
- **"Earn" onboarding flow** with reward previews and CTAs
- **Game cards** with promotional artwork and clear value props

**Apply to Play'd Games Tab:**
```
Profile: [Avatar] teej2           [💰 1,250 Play'd Coins]

Daily Streak Bonus                [Claim 120 ⭐]
┌─────────────────────────────────┐
│  [Monopoly GO Icon]             │
│  120 Coins = 1 Dice Roll        │
│  [$1.00 value] Connected ✅     │
│  [Redeem] [Calculator]          │
└─────────────────────────────────┘
```

### Apple Games Hub (Game Discovery Pattern)
**Visual Elements from Screenshots:**
- **Hero section** with prominent app icon and welcome message
- **"Continue Playing" section** showing recent games including Madden
- **Clean card grid** for game discovery and recommendations
- **Native iOS design language** with system fonts and spacing
- **Bottom navigation** with Home, Arcade, Friends, Library tabs

**Apply to Play'd Structure:**
- Use Apple's card layouts for game presentation
- "Continue Earning" section for active challenges
- Friend activity and recommendations
- Native iOS navigation patterns

## Core Features

### Play'd Coin System
- **Balance Display**: Prominent coin count at app top
- **Earning Animations**: Satisfying coin collection effects
- **Transaction History**: Track earnings and redemptions
- **Exchange Calculator**: Preview redemption values

### Partner Integration
- **OAuth Flows**: Secure connection to partner services
- **Real-time Sync**: Live progress updates from partners
- **Webhook System**: Instant coin delivery on action completion
- **Connection Status**: Visual indicators for linked accounts

### Game Linking
- **Automatic Detection**: Use Game Center teamPlayerID matching
- **Manual Linking**: Backup flow for unsupported games
- **Connection Verification**: Confirm successful account links
- **Multi-game Support**: Link unlimited games per user

### Push Notifications
- **Earning Alerts**: "You earned 100 coins for your workout!"
- **Redemption Confirmations**: "5 dice rolls added to Monopoly GO!"
- **Achievement Reminders**: "Complete today's SoFi challenge"
- **Streak Notifications**: "Keep your 7-day earning streak!"

## Technical Implementation

### Swift/SwiftUI Architecture
```swift
@main
struct PlaydApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    GameCenterManager.shared.authenticate()
                }
        }
    }
}

// Main tab structure
struct ContentView: View {
    var body: some View {
        TabView {
            GamesView()
                .tabItem {
                    Image(systemName: "gamecontroller")
                    Text("Games")
                }

            EarnView()
                .tabItem {
                    Image(systemName: "star.circle")
                    Text("Earn")
                }
        }
    }
}
```

### Game Center Manager
```swift
class GameCenterManager: ObservableObject {
    static let shared = GameCenterManager()
    @Published var isAuthenticated = false
    @Published var teamPlayerID: String?

    func authenticate() {
        GKLocalPlayer.local.authenticateHandler = { viewController, error in
            // Handle authentication flow
            if let teamPlayerID = GKLocalPlayer.local.teamPlayerID {
                self.teamPlayerID = teamPlayerID
                self.linkPlaydAccount(teamPlayerID)
            }
        }
    }
}
```


### Data Models
```swift
struct PlaydUser {
    let id: String // Game Center teamPlayerID
    let coinBalance: Int
    let linkedGames: [LinkedGame]
    let achievements: [Achievement]
}

struct LinkedGame {
    let gameID: String
    let gameName: String
    let iconURL: String
    let conversionRate: Int // Coins per game currency unit
    let isConnected: Bool
}

struct Achievement {
    let id: String
    let partnerName: String
    let title: String
    let description: String
    let coinReward: Int
    let progress: Progress?
    let category: Category // Finance, Health, Learning
}
```

## Partner Integration Flows

### Financial Services (SoFi, Fidelity, etc.)
1. User taps "Connect SoFi" in Earn tab
2. OAuth flow to SoFi authentication
3. Grant permissions for financial data access
4. Play'd monitors for qualifying actions
5. Automatic coin delivery on completion

### Health & Fitness (Fitbit, Apple Health)
1. User grants HealthKit permissions
2. Play'd monitors daily step goals, workouts
3. Real-time progress updates in app
4. Coins awarded upon goal completion
5. Integration with Apple Watch for convenience

### Education (Coursera, Khan Academy)
1. User links learning platform account
2. Play'd tracks course progress via API
3. Milestone achievements earn coins
4. Certificate completions = bonus rewards
5. Streak bonuses for daily learning


### Automatic Delivery Flow
1. User redeems coins in Play'd app
2. Play'd sends webhook to game's servers
3. Game SDK receives reward notification
4. Game automatically adds currency to user account
5. Push notification confirms delivery

## MVP Features for Hackathon Demo

### Must Have (18-Hour Build)
- **Game Center authentication** working
- **Mock partner integrations** (simulate actions)
- **2-3 demo games** with conversion rates
- **Basic redemption flow** (coins → game currency)
- **Simple earning mechanism** (button taps = coins)

### Demo Script Flow
1. **Show app launch** → Game Center auto-login
2. **Simulate workout completion** → Coins appear with animation
3. **Navigate to Games tab** → Show Monopoly GO integration
4. **Redeem 5 dice rolls** → Conversion happens
5. **Switch to demo game** → Rolls automatically available
6. **Show developer revenue** → Dashboard with profit sharing

### Nice to Have (if time permits)
- Real partner OAuth flows
- Push notifications
- Advanced animations
- Multiple game demos
- Detailed analytics

## Success Metrics for Hackathon

### Technical Success
✅ Game Center authentication works
✅ Tab navigation is smooth
✅ Coin earning/redemption flow functions
✅ At least one game integration demo works
✅ App doesn't crash during presentation

### Demo Success
✅ Clear value proposition demonstrated
✅ Live action-to-reward flow shown
✅ Developer benefit explained
✅ Audience can understand the concept
✅ Judges see scalability potential

### Presentation Impact
- "This is Stripe for positive gaming rewards"
- "We're building infrastructure, not just another game"
- "Transform 3.2B mobile gamers from extraction to empowerment"
- "Every workout becomes rewards in every game"
