import GameKit
import SwiftUI

class GameCenterManager: NSObject, ObservableObject {
    static let shared = GameCenterManager()

    @Published var isAuthenticated = false
    @Published var teamPlayerID: String?
    @Published var displayName: String = "Player"

    override init() {
        super.init()
    }

    func authenticate() {
        GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, error in
            if let viewController = viewController {
                // Present the Game Center login view controller
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootViewController = windowScene.windows.first?.rootViewController {
                    rootViewController.present(viewController, animated: true)
                }
            } else if GKLocalPlayer.local.isAuthenticated {
                // Player is authenticated
                self?.isAuthenticated = true
                self?.teamPlayerID = GKLocalPlayer.local.teamPlayerID
                self?.displayName = GKLocalPlayer.local.displayName

                // Link with Play'd backend
                self?.linkPlaydAccount()
            } else if let error = error {
                print("Game Center authentication error: \(error.localizedDescription)")
                // For demo, use mock authentication
                self?.mockAuthentication()
            } else {
                // For demo, use mock authentication
                self?.mockAuthentication()
            }
        }
    }

    private func mockAuthentication() {
        // Mock authentication for demo purposes
        isAuthenticated = true
        teamPlayerID = "DEMO_PLAYER_001"
        displayName = "DemoPlayer"
        linkPlaydAccount()
    }

    private func linkPlaydAccount() {
        guard let teamPlayerID = teamPlayerID else { return }

        // Call Play'd backend to authenticate
        NetworkManager.shared.authenticateWithGameCenter(
            teamPlayerID: teamPlayerID,
            username: displayName
        ) { success in
            if success {
                print("Successfully linked Play'd account")
                UserState.shared.fetchBalance()
            }
        }
    }
}

extension GKLocalPlayer {
    var displayName: String {
        return self.alias
    }
}