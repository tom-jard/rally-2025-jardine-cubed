import SwiftUI

@main
struct PlaydApp: App {
    @StateObject private var userState = UserState.shared
    @StateObject private var deepLinkManager = DeepLinkManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(userState)
                .environmentObject(deepLinkManager)
        }
    }
}