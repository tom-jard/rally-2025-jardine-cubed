import SwiftUI

struct EarnView: View {
    @State private var services: [Service] = []
    @State private var isLoading = true
    @State private var selectedService: Service?
    @State private var showServiceSheet = false
    @EnvironmentObject var userState: UserState

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Header Balance Card
                    ProgressCard()
                        .padding(.horizontal)
                        .padding(.top)

                    // Services Grid
                    LazyVGrid(columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16)
                    ], spacing: 16) {
                        ForEach(services) { service in
                            ServiceAppCard(service: service) {
                                selectedService = service
                                showServiceSheet = true
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 100)
                }
            }
            .background(Color(UIColor.systemGroupedBackground))
            .navigationBarTitleDisplayMode(.large)
            .navigationTitle("Earn Coins")
        }
        .onAppear {
            loadServices()
        }
        .sheet(isPresented: $showServiceSheet) {
            if let service = selectedService {
                ServiceSheet(
                    service: service,
                    isPresented: $showServiceSheet
                )
                .environmentObject(userState)
            }
        }
    }

    private func loadServices() {
        // Hardcoded services with realistic icons
        services = [
            Service(id: "fidelity", name: "Fidelity", icon: "💼", category: "Finance", coinsReward: 500, description: "Complete investment review"),
            Service(id: "vanguard", name: "Vanguard", icon: "📈", category: "Finance", coinsReward: 600, description: "Review portfolio allocation"),
            Service(id: "sofi", name: "SoFi", icon: "🏦", category: "Finance", coinsReward: 400, description: "Complete budget review"),
            Service(id: "headspace", name: "Headspace", icon: "🧠", category: "Wellness", coinsReward: 200, description: "Complete meditation session"),
            Service(id: "peloton", name: "Peloton", icon: "🚴", category: "Fitness", coinsReward: 150, description: "Complete 30-min workout"),
            Service(id: "coursera", name: "Coursera", icon: "🎓", category: "Learning", coinsReward: 300, description: "Complete lesson"),
            Service(id: "duolingo", name: "Duolingo", icon: "🦉", category: "Learning", coinsReward: 100, description: "Complete daily lesson"),
            Service(id: "spotify", name: "Spotify", icon: "🎵", category: "Entertainment", coinsReward: 80, description: "Listen for 1 hour")
        ]
        self.isLoading = false
    }
}

struct ProgressCard: View {
    @EnvironmentObject var userState: UserState

    private let dailyGoal = 500
    private var progress: Int {
        // Mock progress based on coin balance
        min(userState.coinBalance % 1000, dailyGoal)
    }

    var body: some View {
        VStack(spacing: 8) {
            Text("Daily Progress")
                .font(.caption)
                .foregroundColor(.secondary)

            HStack(alignment: .top, spacing: 4) {
                Text("\(progress)")
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                Text("/ \(dailyGoal)")
                    .font(.headline)
                    .foregroundColor(.secondary)
                    .offset(y: 6)
            }

            // Progress Bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: 8)

                    RoundedRectangle(cornerRadius: 8)
                        .fill(
                            LinearGradient(
                                colors: [Color.green, Color.blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * (Double(progress) / Double(dailyGoal)), height: 8)
                }
            }
            .frame(height: 8)

            Text("coins earned today")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}

struct ServiceAppCard: View {
    let service: Service
    let onTap: () -> Void
    @EnvironmentObject var userState: UserState
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var isCompleted = false

    var body: some View {
        Button(action: {
            if !isCompleted {
                completeService()
            }
        }) {
            VStack(spacing: 12) {
                // Service Icon
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(gradientForService(service.id))
                        .frame(width: 70, height: 70)

                    Text(service.icon)
                        .font(.system(size: 36))
                }
                .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

                // Service Name
                Text(service.name)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.primary)
                    .lineLimit(1)

                // Reward
                Text("+\(service.coinsReward) coins")
                    .font(.caption2)
                    .foregroundColor(.green)

                // Action Button
                Text(isCompleted ? "Completed" : "Earn")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(isCompleted ? .gray : .green)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 6)
                    .background((isCompleted ? Color.gray : Color.green).opacity(0.1))
                    .cornerRadius(12)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color(UIColor.secondarySystemGroupedBackground))
            .cornerRadius(16)
        }
        .buttonStyle(PlainButtonStyle())
        .alert("Service Completion", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }

    private func completeService() {
        NetworkManager.shared.completeChallenge(challengeId: service.id) { success, coinsEarned in
            if success {
                userState.updateBalance(userState.coinBalance + service.coinsReward)
                alertMessage = "Earned \(service.coinsReward) coins from \(service.name)!"
                isCompleted = true
            } else {
                alertMessage = "Failed to complete \(service.name) challenge."
            }
            showAlert = true
        }
    }

    private func gradientForService(_ id: String) -> LinearGradient {
        switch id {
        case "fidelity":
            return LinearGradient(colors: [.blue, .indigo], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "vanguard":
            return LinearGradient(colors: [.red, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "sofi":
            return LinearGradient(colors: [.cyan, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "headspace":
            return LinearGradient(colors: [.orange, .pink], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "peloton":
            return LinearGradient(colors: [.red, .black], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "coursera":
            return LinearGradient(colors: [.blue, .cyan], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "duolingo":
            return LinearGradient(colors: [.green, .yellow], startPoint: .topLeading, endPoint: .bottomTrailing)
        case "spotify":
            return LinearGradient(colors: [.green, .black], startPoint: .topLeading, endPoint: .bottomTrailing)
        default:
            return LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }
}

struct ServiceSheet: View {
    let service: Service
    @Binding var isPresented: Bool
    @EnvironmentObject var userState: UserState
    @State private var showSuccess = false

    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Service Icon
                ZStack {
                    RoundedRectangle(cornerRadius: 24)
                        .fill(LinearGradient(colors: [.green, .blue], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 100, height: 100)

                    Text(service.icon)
                        .font(.system(size: 48))
                }

                VStack(spacing: 8) {
                    Text(service.name)
                        .font(.title2)
                        .fontWeight(.bold)

                    Text(service.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }

                // Reward Display
                VStack(spacing: 8) {
                    Text("Earn")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    HStack(alignment: .top, spacing: 4) {
                        Text("+\(service.coinsReward)")
                            .font(.system(size: 48, weight: .bold, design: .rounded))
                            .foregroundColor(.green)
                        Text("coins")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .offset(y: 10)
                    }

                    Text("Value: $\(String(format: "%.2f", Double(service.coinsReward) * 0.008))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Complete Button
                Button(action: completeService) {
                    Text("Complete \(service.name) Task")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(16)
                }
            }
            .padding()
            .navigationTitle("Earn Coins")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        isPresented = false
                    }
                }
            }
        }
        .alert("Success!", isPresented: $showSuccess) {
            Button("OK") {
                isPresented = false
            }
        } message: {
            Text("Earned \(service.coinsReward) coins from \(service.name)!")
        }
    }

    private func completeService() {
        NetworkManager.shared.completeChallenge(challengeId: service.id) { success, coinsEarned in
            if success {
                showSuccess = true
            }
        }
    }
}

#Preview {
    EarnView()
        .environmentObject(UserState.shared)
}