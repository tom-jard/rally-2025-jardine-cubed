import SwiftUI
import GameKit

@main
struct PlaydApp: App {
    @StateObject private var gameCenter = GameCenterManager.shared
    @StateObject private var userState = UserState.shared
    @StateObject private var deepLinkManager = DeepLinkManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    gameCenter.authenticate()
                }
                .environmentObject(gameCenter)
                .environmentObject(userState)
                .environmentObject(deepLinkManager)
        }
    }
}