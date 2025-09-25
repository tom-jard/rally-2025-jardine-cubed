import SwiftUI

struct GamesView: View {
    @State private var games: [Game] = []
    @State private var isLoading = true
    @State private var redemptionAmounts: [String: Int] = [:]
    @State private var showSuccessAlert = false
    @State private var successMessage = ""
    @State private var hasClaimedStreak = false
    @EnvironmentObject var userState: UserState

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Daily Streak Card (Mistplay style)
                DailyStreakCard(hasClaimedStreak: $hasClaimedStreak)
                    .padding(.horizontal)

                // Section Header
                VStack(alignment: .leading, spacing: 4) {
                    Text("Games You'll Love")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)

                    Text("Redeem your Play'd Coins for in-game currency")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)

                // Games List
                ForEach(games) { game in
                    GameCard(
                        game: game,
                        redemptionAmount: redemptionAmounts[game.id] ?? game.conversionRate,
                        onAmountChange: { newAmount in
                            redemptionAmounts[game.id] = newAmount
                        },
                        onRedeem: {
                            redeemCoins(for: game)
                        }
                    )
                }
            }
            .padding(.bottom, 100)
        }
        .background(Color.black)
        .onAppear {
            loadGames()
        }
        .alert("Success!", isPresented: $showSuccessAlert) {
            Button("OK") { }
        } message: {
            Text(successMessage)
        }
    }

    private func loadGames() {
        NetworkManager.shared.fetchGames { fetchedGames in
            self.games = fetchedGames
            for game in fetchedGames {
                self.redemptionAmounts[game.id] = game.conversionRate
            }
            self.isLoading = false
        }
    }

    private func redeemCoins(for game: Game) {
        let amount = redemptionAmounts[game.id] ?? game.conversionRate

        NetworkManager.shared.redeemCoins(gameId: game.id, coinsToSpend: amount) { success, message in
            if success {
                self.successMessage = message
                self.showSuccessAlert = true
            }
        }
    }
}

struct DailyStreakCard: View {
    @Binding var hasClaimedStreak: Bool
    @EnvironmentObject var userState: UserState

    var body: some View {
        HStack {
            HStack(spacing: 12) {
                Text("⚡")
                    .font(.system(size: 36))

                VStack(alignment: .leading, spacing: 2) {
                    Text("Daily Streak Bonus")
                        .font(.headline)
                        .foregroundColor(.white)

                    Text("Keep your streak alive!")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }

            Spacer()

            Button(action: claimStreak) {
                HStack(spacing: 4) {
                    if hasClaimedStreak {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text("Claimed")
                            .fontWeight(.semibold)
                    } else {
                        Text("Claim 120")
                            .fontWeight(.semibold)
                        Text("⭐")
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(
                    hasClaimedStreak
                        ? Color.gray.opacity(0.3)
                        : LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                )
                .foregroundColor(.white)
                .cornerRadius(25)
            }
            .disabled(hasClaimedStreak)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.2), Color.purple.opacity(0.1)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.purple.opacity(0.3), lineWidth: 1)
        )
    }

    private func claimStreak() {
        NetworkManager.shared.claimDailyStreak { success, coinsEarned in
            if success {
                hasClaimedStreak = true
            }
        }
    }
}

struct GameCard: View {
    let game: Game
    let redemptionAmount: Int
    let onAmountChange: (Int) -> Void
    let onRedeem: () -> Void
    @EnvironmentObject var userState: UserState

    var itemsToReceive: Int {
        redemptionAmount / game.conversionRate
    }

    var canAfford: Bool {
        redemptionAmount <= userState.coinBalance
    }

    var body: some View {
        VStack(spacing: 16) {
            // Game Header
            HStack(spacing: 16) {
                Text(game.icon)
                    .font(.system(size: 48))

                VStack(alignment: .leading, spacing: 4) {
                    Text(game.name)
                        .font(.headline)
                        .foregroundColor(.white)

                    Text("\(game.conversionRate) coins = 1 \(game.currencyName)")
                        .font(.caption)
                        .foregroundColor(.gray)
                }

                Spacer()
            }

            // Connection Status & Value
            HStack(spacing: 16) {
                HStack(spacing: 4) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                        .font(.caption)
                    Text("Connected")
                        .font(.caption)
                        .foregroundColor(.green)
                }

                HStack(spacing: 4) {
                    Text("$")
                        .font(.caption)
                    Text(String(format: "%.2f value", game.dollarValue))
                        .font(.caption)
                        .foregroundColor(.yellow)
                }

                Spacer()
            }

            // Redemption Controls
            VStack(spacing: 12) {
                // Amount Selector
                HStack(spacing: 20) {
                    Button(action: {
                        let newAmount = max(game.conversionRate, redemptionAmount - game.conversionRate)
                        onAmountChange(newAmount)
                    }) {
                        Image(systemName: "minus.circle.fill")
                            .font(.title2)
                            .foregroundColor(.purple)
                    }

                    VStack(spacing: 2) {
                        Text("\(redemptionAmount)")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)

                        Text("coins")
                            .font(.caption2)
                            .foregroundColor(.gray)
                    }
                    .frame(minWidth: 80)

                    Button(action: {
                        onAmountChange(redemptionAmount + game.conversionRate)
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundColor(.purple)
                    }
                }

                // Items to Receive
                HStack(spacing: 6) {
                    Image(systemName: "cube.box.fill")
                        .font(.caption)
                        .foregroundColor(.cyan)
                    Text("\(itemsToReceive) \(itemsToReceive == 1 ? game.currencyName : "\(game.currencyName)s")")
                        .font(.caption)
                        .foregroundColor(.cyan)
                }

                // Redeem Button
                Button(action: onRedeem) {
                    Text("Redeem")
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(
                            canAfford
                                ? LinearGradient(
                                    colors: [Color.purple, Color.blue],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                                : LinearGradient(
                                    colors: [Color.gray.opacity(0.3), Color.gray.opacity(0.2)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                        )
                        .cornerRadius(12)
                }
                .disabled(!canAfford)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.05))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

#Preview {
    GamesView()
        .environmentObject(UserState.shared)
        .background(Color.black)
        .preferredColorScheme(.dark)
}