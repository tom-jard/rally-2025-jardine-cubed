import SwiftUI
import UIKit

struct GamesView: View {
    @State private var games: [Game] = []
    @State private var selectedGame: Game?
    @State private var showRedeemSheet = false
    @State private var redemptionAmount: Int = 100
    @EnvironmentObject var userState: UserState

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Games Grid
                    LazyVGrid(columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16)
                    ], spacing: 16) {
                        ForEach(games) { game in
                            GameAppCard(game: game) {
                                selectedGame = game
                                redemptionAmount = game.conversionRate
                                showRedeemSheet = true
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.top)
                    .padding(.bottom, 100)
                }
            }
            .background(Color(UIColor.systemGroupedBackground))
            .navigationBarTitleDisplayMode(.large)
            .navigationTitle("Redeem Coins")
        }
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
            Game(id: "monopoly-go", name: "Monopoly GO", icon: "🎲", conversionRate: 120, dollarValue: 1.00, currencyName: "Rolls", currencyAmount: 100),
            Game(id: "candy-crush", name: "Candy Crush", icon: "🍬", conversionRate: 100, dollarValue: 0.80, currencyName: "Gold Bars", currencyAmount: 80),
            Game(id: "madden-mobile", name: "Madden NFL", icon: "🏈", conversionRate: 200, dollarValue: 1.50, currencyName: "Madden Cash", currencyAmount: 150),
            Game(id: "royal-match", name: "Royal Match", icon: "👑", conversionRate: 150, dollarValue: 1.20, currencyName: "Coins", currencyAmount: 120),
            Game(id: "roblox", name: "Roblox", icon: "🎮", conversionRate: 250, dollarValue: 2.00, currencyName: "Robux", currencyAmount: 200),
            Game(id: "coin-master", name: "Coin Master", icon: "🪙", conversionRate: 80, dollarValue: 0.60, currencyName: "Spins", currencyAmount: 60)
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
        Button(action: {
            onTap()
        }) {
            VStack(spacing: 12) {
                // App Icon
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(gradientForGame(game.id))
                        .frame(width: 70, height: 70)

                    Text(game.icon)
                        .font(.system(size: 36))
                }
                .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

                // App Name
                Text(game.name)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.primary)
                    .lineLimit(1)

                // Conversion Rate
                Text(game.conversionText)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)

                // Redeem Button
                Text("Redeem")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.blue)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(12)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color(UIColor.secondarySystemGroupedBackground))
            .cornerRadius(16)
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

    private func gradientForGame(_ id: String) -> LinearGradient {
        switch id {
        case "monopoly-go":
            return LinearGradient(colors: [.red, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "candy-crush":
            return LinearGradient(colors: [.pink, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "madden-mobile":
            return LinearGradient(colors: [.blue, .cyan], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "royal-match":
            return LinearGradient(colors: [.purple, .pink], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "roblox":
            return LinearGradient(colors: [.red, .yellow], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "coin-master":
            return LinearGradient(colors: [.yellow, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
        default:
            return LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
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
        ZStack {
            // Clean white background
            Color.white
                .ignoresSafeArea()

            VStack(spacing: 30) {
                // Close button
                HStack {
                    Spacer()
                    Button(action: {
                        isPresented = false
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)

                Spacer()

                // Game icon (large)
                ZStack {
                    Circle()
                        .fill(gradientForGame(game.id))
                        .frame(width: 100, height: 100)

                    Text(game.icon)
                        .font(.system(size: 50))
                }
                .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)

                // Game name
                Text(game.name)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.primary)

                // Description
                Text("Get more \(game.currencyName.lowercased()) to keep playing!")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)

                // Roll amount selection
                HStack(spacing: 15) {
                    ForEach(rollOptions, id: \.self) { rolls in
                        Button(action: {
                            selectedAmount = rolls
                        }) {
                            VStack(spacing: 8) {
                                Text("\(rolls)")
                                    .font(.system(size: 24, weight: .bold))
                                    .foregroundColor(selectedAmount == rolls ? .white : .primary)

                                Text("\(game.currencyName)")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(selectedAmount == rolls ? .white : .secondary)
                            }
                            .frame(width: 80, height: 80)
                            .background(
                                selectedAmount == rolls ?
                                Color.blue : Color.gray.opacity(0.1)
                            )
                            .cornerRadius(12)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }

                Spacer()

                // Purchase button
                Button(action: {
                    purchaseRolls()
                }) {
                    HStack {
                        Text("💰")
                            .font(.system(size: 18))
                        Text("Purchase for \(coinCost) coins")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        coinCost <= userState.coinBalance ?
                        Color.blue : Color.gray
                    )
                    .cornerRadius(12)
                }
                .disabled(coinCost > userState.coinBalance)
                .padding(.horizontal, 20)
                .padding(.bottom, 30)
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

    private func gradientForGame(_ id: String) -> LinearGradient {
        switch id {
        case "monopoly-go":
            return LinearGradient(colors: [.red, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "candy-crush":
            return LinearGradient(colors: [.pink, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "madden-mobile":
            return LinearGradient(colors: [.blue, .cyan], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "royal-match":
            return LinearGradient(colors: [.purple, .pink], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "roblox":
            return LinearGradient(colors: [.red, .yellow], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "coin-master":
            return LinearGradient(colors: [.yellow, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
        default:
            return LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
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