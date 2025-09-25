#!/usr/bin/env swift

import Foundation

// Play'd Marketplace Demo Script
print("🎮 Play'd Marketplace Demo")
print("====================================================")

// Demo backend API calls
let baseURL = "http://localhost:5001"

// Function to make API calls
func apiCall(endpoint: String) {
    guard let url = URL(string: "\(baseURL)\(endpoint)") else { return }

    let semaphore = DispatchSemaphore(value: 0)

    let task = URLSession.shared.dataTask(with: url) { data, response, error in
        if let data = data {
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                print("\n✅ \(endpoint):")
                print("   Response: \(json)")
            } else if let jsonArray = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                print("\n✅ \(endpoint):")
                for item in jsonArray.prefix(2) {
                    if let name = item["name"], let icon = item["icon"] {
                        print("   - \(name): \(icon)")
                    }
                }
            }
        }
        semaphore.signal()
    }

    task.resume()
    semaphore.wait()
}

print("\n📱 Play'd iOS App Features:")
print("   • Game Center authentication (mocked)")
print("   • Initial balance: 1,250 Play'd Coins")
print("   • 7-day streak bonus available")

// Test backend endpoints
print("\n🔌 Testing Backend API...")

apiCall(endpoint: "/health")
apiCall(endpoint: "/api/games")
apiCall(endpoint: "/api/coins/balance")

print("\n\n💡 Demo Scenarios:")
print("\n1️⃣ Daily Streak:")
print("   User claims 120 bonus coins")
print("   Balance: 1,250 → 1,370 coins")

print("\n2️⃣ Complete SoFi Challenge:")
print("   'Complete Monthly Budget Review'")
print("   Earn: +500 coins")
print("   Balance: 1,370 → 1,870 coins")

print("\n3️⃣ Redeem for Monopoly GO:")
print("   Exchange: 600 coins → 5 dice rolls")
print("   Balance: 1,870 → 1,270 coins")
print("   💰 Value: $5.00 earned through positive actions!")

print("\n\n🚀 Play'd Vision:")
print("Transform mobile gaming from wealth extraction")
print("to wealth building through real-world progress!")
print("\n'Get Play'd for Living Better' 🎮💰")