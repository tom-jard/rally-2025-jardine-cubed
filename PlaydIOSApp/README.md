# Play'd iOS App

A native iOS application that allows users to redeem coins for in-game currency across popular mobile games, with deep linking to seamlessly connect users to their favorite games.

## 🎮 Features

### **Core Functionality**
- **Game Currency Exchange**: Convert Play'd coins into in-game currency for 6 popular mobile games
- **Native iOS Design**: Clean, App Store-style interface with iOS-native components
- **Real Game Logos**: Authentic game icons instead of generic placeholders
- **Smart Deep Linking**: Automatically opens games when installed, or redirects to App Store

### **Supported Games**
| Game | Currency | Deep Link |
|------|----------|-----------|
| 🎲 **Monopoly GO** | Rolls | `monopolygo://` |
| 🍬 **Candy Crush Saga** | Gold Bars | `candycrushsaga://` |
| 🏈 **Madden NFL Mobile** | Madden Cash | `maddennfl://` |
| 👑 **Royal Match** | Coins | `royalmatch://` |
| 🎮 **Roblox** | Robux | `roblox://` |
| ⚔️ **Clash of Clans** | Gems | `clashofclans://` |

### **Deep Linking System**
- **Automatic Detection**: Checks if games are installed on device
- **Seamless Flow**: Purchase → Success → Deep Link → Open Game
- **App Store Fallback**: Redirects to App Store if game not installed
- **Smart Messaging**: Context-aware alerts based on installation status

## 🏗️ Technical Architecture

### **SwiftUI Components**
```
PlaydApp.swift           # Main app entry point
├── ContentView.swift    # Root navigation view
├── GamesView.swift      # Games list and purchase flow
├── RedeemSheet.swift    # Purchase modal with deep linking
├── Models.swift         # Data models
├── NetworkManager.swift # API communication
├── UserState.swift      # User session management
├── DeepLinkManager.swift # Deep link handling
└── GameCenterManager.swift # Game Center integration
```

### **Key Models**
```swift
struct Game {
    let id: String
    let name: String
    let icon: String
    let conversionRate: Int
    let dollarValue: Double
    let currencyName: String
    let currencyAmount: Int
    let deepLink: String      // Deep link URL scheme
    let appStoreURL: String   // App Store page URL
    let bundleIdentifier: String
}
```

## 🚀 Getting Started

### **Prerequisites**
- Xcode 15.0+
- iOS 17.0+
- Apple Developer Account (for device testing)

### **Installation**
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/rally-2025-jardine-cubed.git
   cd rally-2025-jardine-cubed/PlaydIOSApp
   ```

2. **Open in Xcode**
   ```bash
   open PlaydIOSApp.xcodeproj
   ```

3. **Set up code signing**
   - Select PlaydIOSApp project
   - Go to "Signing & Capabilities"
   - Select your development team
   - Ensure bundle identifier is unique

### **Running on Simulator**
- Select iOS Simulator from device menu
- Press Cmd+R to build and run
- **Note**: Deep linking has limitations in simulator

### **Running on Device** (Recommended for full experience)
1. **Connect iPhone** via USB
2. **Select your device** from device menu in Xcode
3. **Trust developer** on device if prompted
4. **Install test games** (Monopoly GO, Candy Crush, etc.) for full deep linking experience

## 🎯 Usage Flow

### **Complete User Journey**
1. **Browse Games**: View available games with real logos
2. **Select Game**: Tap GET button to open purchase modal
3. **Choose Amount**: Select 10, 25, or 50 currency units
4. **Purchase**: Use demo coins to buy in-game currency
5. **Success Alert**: Confirmation of purchase
6. **Deep Link Alert**: Smart detection with two paths:
   - **Game Installed**: "Open App" → Direct launch
   - **Game Not Installed**: "Open in App Store" → Store page

### **Demo Mode**
- App runs in demo mode with 10,000 starting coins
- Purchases deduct coins locally for testing
- No backend required for demonstration

## 🔧 Development

### **Project Structure**
```
PlaydIOSApp/
├── PlaydIOSApp/
│   ├── Assets.xcassets/          # App icons and game logos
│   ├── *.swift                   # Swift source files
│   └── logos/                    # Original logo files
├── PlaydIOSApp.xcodeproj/        # Xcode project
└── README.md                     # This file
```

### **Key Features Implementation**

#### **Native iOS Design**
- Uses `List` and `NavigationView` for iOS-native feel
- App Store-style game cards with rounded corners
- iOS system fonts and colors
- Proper navigation bar and modal presentations

#### **Deep Link Manager**
```swift
class DeepLinkManager {
    func openApp(_ game: Game, completion: @escaping (Bool) -> Void)
    func openAppStore(_ game: Game, completion: @escaping (Bool) -> Void)
    func isAppInstalled(_ game: Game) -> Bool
}
```

#### **Smart Purchase Flow**
- Real-time coin balance updates with animations
- Input validation and error handling
- Context-aware success messaging
- Automatic deep link detection and routing

## 🧪 Testing

### **Simulator Testing**
- Basic UI and purchase flow testing
- Limited deep linking (App Store URLs may fail)
- Coin balance and state management verification

### **Device Testing** (Recommended)
- Full deep linking functionality
- Real App Store integration
- Complete user experience validation

### **Test Scenarios**
1. **With Games Installed**: Test direct app launching
2. **Without Games**: Verify App Store redirection
3. **Insufficient Coins**: Test validation and error states
4. **Multiple Purchases**: Verify balance tracking

## 📱 Screenshots

*Screenshots would go here showing:*
- Games list with real logos
- Purchase modal interface
- Deep link success alerts
- Native iOS styling

## 🚧 Future Enhancements

### **Potential Improvements**
- **Backend Integration**: Real coin balance and purchase tracking
- **Push Notifications**: Purchase confirmations and game updates
- **User Profiles**: Persistent accounts and purchase history
- **More Games**: Expand supported game library
- **Analytics**: Track usage and conversion metrics
- **In-App Purchases**: Real money transactions

### **Technical Improvements**
- **Offline Support**: Cache game data and queue purchases
- **Error Recovery**: Robust network failure handling
- **Accessibility**: VoiceOver and accessibility improvements
- **Localization**: Multi-language support

## 📄 License

This project is part of the Vibe Coding Competition 2025 - Team Jardine³

---

**Built with ❤️ by Team Jardine³ for the Vibe Coding Competition 2025**
- Thomas Jardine (Product Strategy & Frontend)
- Hayden Jardine (Full-Stack & AI Integration)
- Tom Jardine (Data Engineering & QA)

*"The democratization of development so that anyone, anywhere can build something life-changing."*