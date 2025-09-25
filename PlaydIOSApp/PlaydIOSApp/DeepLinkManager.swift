import Foundation
import UIKit

class DeepLinkManager: ObservableObject {
    static let shared = DeepLinkManager()

    private init() {}

    func openApp(_ game: Game, completion: @escaping (Bool) -> Void) {
        // For demo purposes, since we can't register URL schemes in this context,
        // we'll go directly to the App Store
        openAppStore(game, completion: completion)
    }

    func openAppStore(_ game: Game, completion: @escaping (Bool) -> Void) {
        guard let appStoreURL = URL(string: game.appStoreURL) else {
            completion(false)
            return
        }

        // Check if we can open the App Store URL directly
        if UIApplication.shared.canOpenURL(appStoreURL) {
            UIApplication.shared.open(appStoreURL) { success in
                DispatchQueue.main.async {
                    completion(success)
                }
            }
        } else {
            // Fallback for simulator - open web version
            let webURL = game.appStoreURL.replacingOccurrences(of: "apps.apple.com", with: "apps.apple.com")
            if let webAppStoreURL = URL(string: webURL) {
                UIApplication.shared.open(webAppStoreURL) { success in
                    DispatchQueue.main.async {
                        completion(success)
                    }
                }
            } else {
                completion(false)
            }
        }
    }

    func isAppInstalled(_ game: Game) -> Bool {
        guard let deepLinkURL = URL(string: game.deepLink) else {
            return false
        }
        return UIApplication.shared.canOpenURL(deepLinkURL)
    }
}