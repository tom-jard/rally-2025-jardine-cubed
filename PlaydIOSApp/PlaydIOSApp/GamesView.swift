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
            Game(id: "monopoly-go", name: "Monopoly GO", icon: "monopoly_go", conversionRate: 120, dollarValue: 1.00, currencyName: "Rolls", currencyAmount: 100),
            Game(id: "candy-crush", name: "Candy Crush", icon: "candy_crush", conversionRate: 100, dollarValue: 0.80, currencyName: "Gold Bars", currencyAmount: 80),
            Game(id: "madden-mobile", name: "Madden NFL", icon: "madden", conversionRate: 200, dollarValue: 1.50, currencyName: "Madden Cash", currencyAmount: 150),
            Game(id: "royal-match", name: "Royal Match", icon: "royal_match", conversionRate: 150, dollarValue: 1.20, currencyName: "Coins", currencyAmount: 120),
            Game(id: "roblox", name: "Roblox", icon: "roblox", conversionRate: 250, dollarValue: 2.00, currencyName: "Robux", currencyAmount: 200),
            Game(id: "clash-of-clans", name: "Clash of Clans", icon: "clash_of_clans", conversionRate: 180, dollarValue: 1.30, currencyName: "Gems", currencyAmount: 130)
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
                        Button(action: {
                            selectedAmount = rolls
                        }) {
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
                        }
                        .buttonStyle(PlainButtonStyle())
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
                isPresented = false
            }
        } message: {
            Text("Purchased \(selectedAmount) \(game.currencyName.lowercased()) for \(game.name)!")
        }
    }

    private func purchaseRolls() {
        if coinCost > userState.coinBalance {
            return
        }

        NetworkManager.shared.redeemCoins(gameId: game.id, coinsToSpend: coinCost) { success, message in
            if success {
                userState.updateBalance(userState.coinBalance - coinCost)
                showSuccess = true
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