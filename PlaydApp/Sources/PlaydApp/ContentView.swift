import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    @EnvironmentObject var userState: UserState

    var body: some View {
        ZStack {
            Color.black
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                HeaderView()
                    .padding(.top, 50)

                // Main Content
                if selectedTab == 0 {
                    GamesView()
                } else {
                    EarnView()
                }

                Spacer()

                // Tab Bar
                CustomTabBar(selectedTab: $selectedTab)
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct HeaderView: View {
    @EnvironmentObject var userState: UserState

    var body: some View {
        HStack {
            // User Info
            HStack(spacing: 10) {
                Image(systemName: "person.circle.fill")
                    .font(.title2)
                    .foregroundColor(.purple)

                Text(userState.username)
                    .font(.headline)
                    .foregroundColor(.white)
            }

            Spacer()

            // Coin Balance
            HStack(spacing: 8) {
                Text("💰")
                    .font(.title2)

                Text("\(userState.coinBalance)")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.yellow)
                    .animation(.spring(), value: userState.coinBalance)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white.opacity(0.1))
            )

            // Streak
            HStack(spacing: 4) {
                Text("🔥")
                    .font(.title3)
                Text("\(userState.streakDays)")
                    .font(.headline)
                    .foregroundColor(.orange)
            }
        }
        .padding(.horizontal)
    }
}

struct CustomTabBar: View {
    @Binding var selectedTab: Int

    var body: some View {
        HStack(spacing: 0) {
            TabButton(
                icon: "gamecontroller.fill",
                title: "Games",
                isSelected: selectedTab == 0,
                action: { selectedTab = 0 }
            )

            TabButton(
                icon: "star.fill",
                title: "Earn",
                isSelected: selectedTab == 1,
                action: { selectedTab = 1 }
            )
        }
        .padding(.top, 12)
        .padding(.bottom, 30)
        .background(
            Color.black
                .overlay(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.2), Color.clear],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
        )
    }
}

struct TabButton: View {
    let icon: String
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? .purple : .gray)

                Text(title)
                    .font(.caption)
                    .foregroundColor(isSelected ? .purple : .gray)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(GameCenterManager.shared)
            .environmentObject(UserState.shared)
            .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
        .environmentObject(GameCenterManager.shared)
        .environmentObject(UserState.shared)
        .preferredColorScheme(.dark)
}