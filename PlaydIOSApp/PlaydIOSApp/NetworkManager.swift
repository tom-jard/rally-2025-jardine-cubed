import Foundation

class NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "http://localhost:5001"

    private init() {}

    func authenticateWithGameCenter(teamPlayerID: String, username: String, completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/auth/gamecenter") else {
            completion(false)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["teamPlayerId": teamPlayerID, "username": username]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let token = json["token"] as? String,
                  let user = json["user"] as? [String: Any] else {
                completion(false)
                return
            }

            DispatchQueue.main.async {
                UserState.shared.saveToken(token)
                UserState.shared.username = user["username"] as? String ?? "Player"
                UserState.shared.coinBalance = user["coin_balance"] as? Int ?? 0
                UserState.shared.streakDays = user["streak_days"] as? Int ?? 0
                completion(true)
            }
        }.resume()
    }

    func fetchCoinBalance(completion: @escaping (Int, Int) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/coins/balance"),
              let token = UserState.shared.token else {
            completion(0, 0)
            return
        }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let balance = json["balance"] as? Int,
                  let streak = json["streak"] as? Int else {
                completion(0, 0)
                return
            }

            completion(balance, streak)
        }.resume()
    }

    func fetchGames(completion: @escaping ([Game]) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/games") else {
            completion([])
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data,
                  let jsonArray = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
                completion([])
                return
            }

            let games = jsonArray.compactMap { dict -> Game? in
                guard let id = dict["id"] as? String,
                      let name = dict["name"] as? String,
                      let icon = dict["icon"] as? String,
                      let conversionRate = dict["conversion_rate"] as? Int,
                      let dollarValue = dict["dollar_value"] as? Double else {
                    return nil
                }

                return Game(
                    id: id,
                    name: name,
                    icon: icon,
                    conversionRate: conversionRate,
                    dollarValue: dollarValue,
                    currencyName: "Items",
                    currencyAmount: conversionRate
                )
            }

            DispatchQueue.main.async {
                completion(games)
            }
        }.resume()
    }

    func fetchChallenges(completion: @escaping ([String: [Challenge]]) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/challenges") else {
            completion([:])
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: [[String: Any]]] else {
                completion([:])
                return
            }

            var challenges: [String: [Challenge]] = [:]

            for (category, challengeArray) in json {
                challenges[category] = challengeArray.compactMap { dict -> Challenge? in
                    guard let id = dict["id"] as? String,
                          let partner = dict["partner"] as? String,
                          let title = dict["title"] as? String,
                          let description = dict["description"] as? String,
                          let coinsReward = dict["coins_reward"] as? Int,
                          let icon = dict["icon"] as? String else {
                        return nil
                    }

                    return Challenge(
                        id: id,
                        partner: partner,
                        title: title,
                        description: description,
                        coinsReward: coinsReward,
                        category: category,
                        icon: icon
                    )
                }
            }

            DispatchQueue.main.async {
                completion(challenges)
            }
        }.resume()
    }

    func redeemCoins(gameId: String, coinsToSpend: Int, completion: @escaping (Bool, String) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/redeem"),
              let token = UserState.shared.token else {
            completion(false, "Authentication required")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body = ["gameId": gameId, "coinsToSpend": coinsToSpend] as [String : Any]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let success = json["success"] as? Bool else {
                completion(false, "Redemption failed")
                return
            }

            if success {
                let message = json["message"] as? String ?? "Redeemed successfully"
                let newBalance = json["new_balance"] as? Int ?? 0

                DispatchQueue.main.async {
                    UserState.shared.updateBalance(newBalance)
                    completion(true, message)
                }
            } else {
                let error = json["error"] as? String ?? "Unknown error"
                completion(false, error)
            }
        }.resume()
    }

    func completeChallenge(challengeId: String, completion: @escaping (Bool, Int) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/actions/complete"),
              let token = UserState.shared.token else {
            completion(false, 0)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body = ["challengeId": challengeId]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let success = json["success"] as? Bool else {
                completion(false, 0)
                return
            }

            if success {
                let coinsEarned = json["coins_earned"] as? Int ?? 0
                let newBalance = json["new_balance"] as? Int ?? 0

                DispatchQueue.main.async {
                    UserState.shared.updateBalance(newBalance)
                    completion(true, coinsEarned)
                }
            } else {
                completion(false, 0)
            }
        }.resume()
    }

    func claimDailyStreak(completion: @escaping (Bool, Int) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/streak/claim"),
              let token = UserState.shared.token else {
            completion(false, 0)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let success = json["success"] as? Bool else {
                completion(false, 0)
                return
            }

            if success {
                let coinsEarned = json["coins_earned"] as? Int ?? 0
                let newBalance = json["new_balance"] as? Int ?? 0
                let newStreak = json["streak_days"] as? Int ?? 0

                DispatchQueue.main.async {
                    UserState.shared.updateBalance(newBalance)
                    UserState.shared.streakDays = newStreak
                    completion(true, coinsEarned)
                }
            } else {
                completion(false, 0)
            }
        }.resume()
    }
}