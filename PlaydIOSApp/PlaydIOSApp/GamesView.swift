import SwiftUI
import UIKit

struct GamesView: View {
    @State private var games: [Game] = []
    @State private var selectedGame: Game?
    @State private var showRedeemSheet = false
    @State private var redemptionAmount: Int = 100
    @EnvironmentObject var userState: UserState

    var body: some View {
        List {
            Section {
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 12),
                    GridItem(.flexible(), spacing: 12)
                ], spacing: 16) {
                    ForEach(games) { game in
                        GameAppCard(game: game) {
                            selectedGame = game
                            redemptionAmount = game.conversionRate
                            showRedeemSheet = true
                        }
                    }
                }
                .padding(.vertical, 8)
            } header: {
                Text("Popular Games")
                    .font(.headline)
                    .fontWeight(.semibold)
            }
        }
        .navigationTitle("Redeem Coins")
        .onAppear {
            loadGames()
        }
        .sheet(isPresented: $showRedeemSheet) {
            if let game = selectedGame {
                RedeemSheet(
                    game: game,
                    amount: $redemptionAmount,
                    isPresented: $showRedeemSheet
                )
                .environmentObject(userState)
            }
        }
    }

    private func loadGames() {
        games = [
            Game(
                id: "monopoly-go",
                name: "Monopoly GO",
                icon: "monopoly_go",
                conversionRate: 120,
                dollarValue: 1.00,
                currencyName: "Rolls",
                currencyAmount: 100,
                deepLink: "https://mply.io/gN269OQpyfc",
                appStoreURL: "https://apps.apple.com/us/app/monopoly-go/id1621328561",
                bundleIdentifier: "com.scopely.monopolygo",
                alternateSchemes: [
                    "monopolygo://",
                    "com.scopely.monopolygo://",
                    "https://go.monopolygo.com/",
                    "https://monopolygo.com/",
                    "monopoly-go://",
                    "scopely://"
                ]
            ),
            Game(
                id: "candycrushsaga",
                name: "Candy Crush Saga",
                icon: "candy_crush",
                conversionRate: 100,
                dollarValue: 1.0,
                currencyName: "Gold Bars",
                currencyAmount: 100,
                deepLink: "https://ccs.play.king.com/",
                appStoreURL: "https://apps.apple.com/us/app/candy-crush-saga/id553834731",
                bundleIdentifier: "com.king.candycrushsaga",
                alternateSchemes: []
            ),
            Game(
                id: "maddennfl",
                name: "Madden NFL Mobile",
                icon: "madden",
                conversionRate: 100,
                dollarValue: 1.0,
                currencyName: "Cash",
                currencyAmount: 100,
                deepLink: "https://apps.apple.com/us/app/madden-nfl-24-mobile-football/id1094930513",
                appStoreURL: "https://apps.apple.com/us/app/madden-nfl-24-mobile-football/id1094930513",
                bundleIdentifier: "com.ea.ios.maddenmobile",
                alternateSchemes: []
            ),
            Game(
                id: "royalmatch",
                name: "Royal Match",
                icon: "royal_match",
                conversionRate: 100,
                dollarValue: 1.0,
                currencyName: "Coins",
                currencyAmount: 100,
                deepLink: "https://apps.apple.com/us/app/royal-match/id1482155847",
                appStoreURL: "https://apps.apple.com/us/app/royal-match/id1482155847",
                bundleIdentifier: "com.dreamgames.royalmatch",
                alternateSchemes: []
            ),
            Game(
                id: "roblox",
                name: "Roblox",
                icon: "roblox",
                conversionRate: 100,
                dollarValue: 1.0,
                currencyName: "Robux",
                currencyAmount: 100,
                deepLink: "https://www.roblox.com/games/",
                appStoreURL: "https://apps.apple.com/us/app/roblox/id431946152",
                bundleIdentifier: "com.roblox.robloxmobile",
                alternateSchemes: ["roblox://"]
            ),
            Game(
                id: "clashofclans",
                name: "Clash of Clans",
                icon: "clash_of_clans",
                conversionRate: 100,
                dollarValue: 1.0,
                currencyName: "Gems",
                currencyAmount: 100,
                deepLink: "https://link.clashofclans.com/",
                appStoreURL: "https://apps.apple.com/us/app/clash-of-clans/id529479190",
                bundleIdentifier: "com.supercell.magic",
                alternateSchemes: ["clashofclans://"]
            )
        ]
    }
}

struct GameAppCard: View {
    let game: Game
    let onTap: () -> Void
    @EnvironmentObject var userState: UserState
    @State private var showAlert = false
    @State private var alertMessage = ""

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                // App Icon with iOS App Store style
                Image(game.icon)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 64, height: 64)
                    .cornerRadius(18)
                    .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)

                VStack(spacing: 4) {
                    // App Name
                    Text(game.name)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.primary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)

                    // Cost
                    Text("\(game.conversionRate) coins")
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    // Get Button - iOS App Store style
                    Button(action: onTap) {
                        Text("GET")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 60, height: 24)
                            .background(Color.blue)
                            .cornerRadius(12)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
        }
        .buttonStyle(PlainButtonStyle())
        .alert("Redemption", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }

    private func redeemCoins() {
        let amount = game.conversionRate
        if amount > userState.coinBalance {
            alertMessage = "Insufficient coins! Need \(amount) but only have \(userState.coinBalance)."
            showAlert = true
            return
        }

        NetworkManager.shared.redeemCoins(gameId: game.id, coinsToSpend: amount) { success, message in
            if success {
                userState.updateBalance(userState.coinBalance - amount)
                alertMessage = "Successfully redeemed \(amount / game.conversionRate) items in \(game.name)!"
            } else {
                alertMessage = message
            }
            showAlert = true
        }
    }

}

struct StoreOption {
    let rolls: Int
    let bonusRolls: Int
    let coinsRequired: Int
    let dollarValue: Double
    let bonusPercentage: Int?
    let isPopular: Bool

    var totalRolls: Int { rolls + bonusRolls }
    var displayPrice: String { "$\(String(format: "%.2f", dollarValue))" }
}

struct RedeemSheet: View {
    let game: Game
    @Binding var amount: Int
    @Binding var isPresented: Bool
    @EnvironmentObject var userState: UserState
    @State private var selectedAmount = 10
    @State private var showSuccess = false
    @State private var showDeepLinkAlert = false
    @StateObject private var deepLinkManager = DeepLinkManager.shared

    private var rollOptions = [10, 25, 50]

    private var coinCost: Int {
        return selectedAmount * (game.conversionRate / game.currencyAmount)
    }

    init(game: Game, amount: Binding<Int>, isPresented: Binding<Bool>) {
        self.game = game
        self._amount = amount
        self._isPresented = isPresented
    }

    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                VStack(spacing: 16) {
                    // Game icon (large) - iOS style
                    Image(game.icon)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 88, height: 88)
                        .cornerRadius(22)
                        .shadow(color: .black.opacity(0.15), radius: 8, x: 0, y: 4)

                    VStack(spacing: 8) {
                        // Game name
                        Text(game.name)
                            .font(.title2)
                            .fontWeight(.bold)

                        // Description
                        Text("Choose how many \(game.currencyName.lowercased()) you'd like to purchase")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                }

                // Selection options - iOS style picker
                VStack(spacing: 12) {
                    ForEach(rollOptions, id: \.self) { rolls in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("\(rolls) \(game.currencyName)")
                                    .font(.headline)
                                    .foregroundColor(.primary)

                                Text("\(rolls * (game.conversionRate / game.currencyAmount)) coins")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Spacer()

                            if selectedAmount == rolls {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.blue)
                                    .font(.title3)
                            }
                        }
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(selectedAmount == rolls ? Color.blue.opacity(0.1) : Color.clear)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(selectedAmount == rolls ? Color.blue : Color.gray.opacity(0.3), lineWidth: 1)
                                )
                        )
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedAmount = rolls
                        }
                    }
                }
                .padding(.horizontal)

                Spacer()

                // Purchase button - iOS style
                Button(action: purchaseRolls) {
                    Text("Purchase for \(coinCost) coins")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            coinCost <= userState.coinBalance ? Color.blue : Color.gray
                        )
                        .cornerRadius(12)
                }
                .disabled(coinCost > userState.coinBalance)
                .padding(.horizontal)
            }
            .padding()
            .navigationTitle("Purchase \(game.currencyName)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        isPresented = false
                    }
                }
            }
        }
        .alert("Success!", isPresented: $showSuccess) {
            Button("OK") {
                print("🎯 First alert OK tapped, showing deep link alert")
                showDeepLinkAlert = true
            }
        } message: {
            Text("Purchased \(selectedAmount) \(game.currencyName.lowercased()) for \(game.name)!")
        }
        .alert("Purchase Complete!", isPresented: $showDeepLinkAlert) {
            Button("Open App") {
                print("🎯 Open App button tapped for \(game.name)")
                deepLinkManager.openApp(game) { success in
                    if !success {
                        print("Failed to open \(game.name), user will need to open manually")
                    }
                    isPresented = false
                }
            }
            Button("Get from App Store") {
                deepLinkManager.openAppStore(game) { success in
                    isPresented = false
                }
            }
            Button("OK") {
                isPresented = false
            }
        } message: {
            Text("Your \(selectedAmount) \(game.currencyName.lowercased()) are ready!")
        }
    }

    private func purchaseRolls() {
        if coinCost > userState.coinBalance {
            return
        }

        print("🎯 Starting purchase for \(game.name) - \(coinCost) coins")
        NetworkManager.shared.redeemCoins(gameId: game.id, coinsToSpend: coinCost) { success, message in
            if success {
                print("🎯 Purchase successful, showing success alert")
                userState.updateBalance(userState.coinBalance - coinCost)
                showSuccess = true
            } else {
                print("🎯 Purchase failed: \(message)")
            }
        }
    }

}


extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

#Preview {
    GamesView()
        .environmentObject(UserState.shared)
}