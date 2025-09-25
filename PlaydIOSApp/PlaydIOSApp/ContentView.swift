import SwiftUI

struct ContentView: View {
    @EnvironmentObject var userState: UserState

    var body: some View {
        NavigationView {
            GamesView()
                .navigationBarTitleDisplayMode(.large)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        HeaderView()
                    }
                }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct HeaderView: View {
    @EnvironmentObject var userState: UserState

    var body: some View {
        HStack(spacing: 16) {
            // Coin Balance
            HStack(spacing: 6) {
                Image(systemName: "bitcoinsign.circle.fill")
                    .foregroundColor(.orange)
                    .font(.headline)

                Text("\(userState.coinBalance)")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .animation(.spring(), value: userState.coinBalance)
            }

            // Streak
            HStack(spacing: 4) {
                Image(systemName: "flame.fill")
                    .foregroundColor(.orange)
                    .font(.subheadline)
                Text("\(userState.streakDays)")
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
        }
    }
}

// Removed tab bar components since we're focusing only on Games

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(UserState.shared)
            .environmentObject(DeepLinkManager.shared)
            .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
        .environmentObject(UserState.shared)
        .environmentObject(DeepLinkManager.shared)
        .preferredColorScheme(.dark)
}