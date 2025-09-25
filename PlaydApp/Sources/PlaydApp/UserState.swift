import SwiftUI
import Combine

class UserState: ObservableObject {
    static let shared = UserState()

    @Published var username: String = "Player"
    @Published var coinBalance: Int = 0
    @Published var streakDays: Int = 0
    @Published var userId: String?
    @Published var token: String?

    private init() {
        loadStoredData()
    }

    private func loadStoredData() {
        if let token = UserDefaults.standard.string(forKey: "playd_token") {
            self.token = token
        }
        if let userId = UserDefaults.standard.string(forKey: "playd_user_id") {
            self.userId = userId
        }
    }

    func fetchBalance() {
        NetworkManager.shared.fetchCoinBalance { [weak self] balance, streak in
            DispatchQueue.main.async {
                self?.coinBalance = balance
                self?.streakDays = streak
            }
        }
    }

    func updateBalance(_ newBalance: Int) {
        DispatchQueue.main.async {
            withAnimation(.spring()) {
                self.coinBalance = newBalance
            }
        }
    }

    func saveToken(_ token: String) {
        self.token = token
        UserDefaults.standard.set(token, forKey: "playd_token")
    }

    func saveUserId(_ userId: String) {
        self.userId = userId
        UserDefaults.standard.set(userId, forKey: "playd_user_id")
    }
}