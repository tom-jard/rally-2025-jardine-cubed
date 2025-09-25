import Foundation
import UIKit

class DeepLinkManager: ObservableObject {
    static let shared = DeepLinkManager()

    private init() {}

    func openApp(_ game: Game, completion: @escaping (Bool) -> Void) {
        print("💡 Attempting to open \(game.name) with deep link: \(game.deepLink)")

        guard let url = URL(string: game.deepLink) else {
            print("❌ Invalid URL: \(game.deepLink)")
            DispatchQueue.main.async {
                completion(false)
            }
            return
        }

        if UIApplication.shared.canOpenURL(url) {
            print("✅ Can open URL, attempting to launch \(game.name)")
            UIApplication.shared.open(url) { success in
                DispatchQueue.main.async {
                    print(success ? "✅ Successfully opened \(game.name)" : "❌ Failed to open \(game.name)")
                    completion(success)
                }
            }
        } else {
            print("❌ Cannot open URL: \(game.deepLink)")
            DispatchQueue.main.async {
                completion(false)
            }
        }
    }

    private func showNoDeepLinkAlert(for game: Game) {
        // This would ideally show an alert, but since we can't from here,
        // we'll just log for now
        print("💡 Deep linking not available for \(game.name). Most games don't support third-party deep links for security reasons.")
    }

    private func findWorkingScheme(for game: Game) -> String? {
        print("🔍 Testing schemes for \(game.name):")

        // Try primary scheme first
        print("  Testing primary: \(game.deepLink)")
        if let primaryURL = URL(string: game.deepLink),
           UIApplication.shared.canOpenURL(primaryURL) {
            print("  ✅ Primary scheme works: \(game.deepLink)")
            return game.deepLink
        }

        // Try alternate schemes
        for scheme in game.alternateSchemes {
            print("  Testing alternate: \(scheme)")
            if let url = URL(string: scheme),
               UIApplication.shared.canOpenURL(url) {
                print("  ✅ Alternate scheme works: \(scheme)")
                return scheme
            }
        }

        print("  ❌ No working schemes found for \(game.name)")
        return nil
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
        return findWorkingScheme(for: game) != nil
    }
}