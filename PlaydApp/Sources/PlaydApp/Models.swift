import Foundation

struct Game: Identifiable, Codable {
    let id: String
    let name: String
    let icon: String
    let conversionRate: Int
    let dollarValue: Double

    var currencyName: String {
        switch name {
        case "Monopoly GO":
            return "Dice Roll"
        case "Madden Mobile":
            return "Madden Cash"
        case "Candy Crush":
            return "Gold Bar"
        default:
            return "Item"
        }
    }
}

struct Challenge: Identifiable, Codable {
    let id: String
    let partner: String
    let title: String
    let description: String
    let coinsReward: Int
    let category: String
    let icon: String
}

struct PlaydUser: Codable {
    let id: String
    let teamPlayerID: String
    let username: String
    let coinBalance: Int
    let streakDays: Int
}

struct RedemptionResult: Codable {
    let success: Bool
    let coinsSpent: Int
    let gameCurrencyReceived: Int
    let newBalance: Int
    let gameName: String
    let message: String
}

struct ChallengeCompletionResult: Codable {
    let success: Bool
    let coinsEarned: Int
    let newBalance: Int
    let message: String
}