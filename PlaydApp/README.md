# Play'd iOS App

## 📱 Opening the App

Since Xcode is not installed on this system, here are your options to run the iOS app:

### Option 1: Install Xcode (Recommended)
1. Open the Mac App Store
2. Search for "Xcode"
3. Install Xcode (it's free but large ~7GB)
4. Once installed, double-click any `.swift` file in this folder to open the project

### Option 2: Use Xcode Cloud (Alternative)
1. Upload this folder to a GitHub repository
2. Use Xcode Cloud to build and test

### Option 3: Manual Setup in Xcode
1. Open Xcode
2. Create a new iOS App project
3. Choose:
   - Product Name: PlaydApp
   - Team: Your Apple ID
   - Organization Identifier: com.jardine3
   - Interface: SwiftUI
   - Language: Swift
4. Copy all `.swift` files from this folder into the new project
5. Enable Game Center capability in project settings

## 🎮 App Structure

```
PlaydApp/
├── PlaydApp.swift          # Main app entry point
├── ContentView.swift       # Main view with tab navigation
├── GameCenterManager.swift # Game Center authentication
├── UserState.swift         # Global state management
├── NetworkManager.swift    # API communication layer
├── Models.swift           # Data models
├── GamesView.swift        # Games tab (Mistplay-style)
└── EarnView.swift         # Earn tab (Apple Fitness-style)
```

## 🚀 Features

### Games Tab
- Daily streak bonus claiming
- Game cards with real-time redemption
- Animated coin balance updates
- Value transparency ($1.00 per roll)

### Earn Tab
- Progress tracking (500 coins daily goal)
- Categorized challenges (Finance, Health, Learning)
- Partner integrations (SoFi, Fitbit, Coursera)
- Animated completion states

### Authentication
- Game Center integration (mocked for demo)
- Universal teamPlayerID for cross-game identity
- JWT token management

## 🎨 Design
- Dark theme with purple-teal gradients
- Inspired by Mistplay and Apple Fitness
- SwiftUI animations throughout
- Native iOS design patterns

## 🔧 Configuration

The app connects to the backend at `http://localhost:5000`. To change this:
1. Edit `NetworkManager.swift`
2. Update `private let baseURL = "http://localhost:5000"`
3. Change to your server URL

## 📲 Testing Without Xcode

You can review the Swift code in any text editor. The app follows standard SwiftUI patterns and is fully commented for readability.

Key files to review:
- `GamesView.swift` - See the Mistplay-inspired redemption interface
- `EarnView.swift` - See the Apple Fitness-inspired challenges interface
- `NetworkManager.swift` - Understand the API integration

## 🎯 Demo Flow

When running in Xcode:
1. App launches with mock Game Center auth
2. Shows 1,250 initial Play'd Coins
3. Games tab: Claim daily streak for 120 coins
4. Earn tab: Complete challenges to earn more
5. Games tab: Redeem coins for game currency
6. Watch balance update in real-time

The app demonstrates the core Play'd concept: transforming mobile gaming from extraction to empowerment!