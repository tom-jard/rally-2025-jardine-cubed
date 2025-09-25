import SwiftUI

struct EarnView: View {
    @State private var challenges: [String: [Challenge]] = [:]
    @State private var expandedCategory: String? = "Finance"
    @State private var completedChallenges: Set<String> = []
    @State private var isLoading = true
    @EnvironmentObject var userState: UserState

    private var todayProgress: Int {
        challenges.values.flatMap { $0 }
            .filter { completedChallenges.contains($0.id) }
            .reduce(0) { $0 + $1.coinsReward }
    }

    private let dailyGoal = 500

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Progress Card (Apple Fitness style)
                ProgressCard(progress: todayProgress, goal: dailyGoal)
                    .padding(.horizontal)

                // Challenges by Category
                ForEach(Array(challenges.keys.sorted()), id: \.self) { category in
                    CategorySection(
                        category: category,
                        challenges: challenges[category] ?? [],
                        isExpanded: expandedCategory == category,
                        completedChallenges: completedChallenges,
                        onToggle: {
                            withAnimation(.spring()) {
                                expandedCategory = expandedCategory == category ? nil : category
                            }
                        },
                        onCompleteChallenge: { challenge in
                            completeChallenge(challenge)
                        }
                    )
                }

                // Coming Soon Section
                ComingSoonCard()
                    .padding(.horizontal)
            }
            .padding(.bottom, 100)
        }
        .background(Color.black)
        .onAppear {
            loadChallenges()
        }
    }

    private func loadChallenges() {
        NetworkManager.shared.fetchChallenges { fetchedChallenges in
            self.challenges = fetchedChallenges
            self.isLoading = false
        }
    }

    private func completeChallenge(_ challenge: Challenge) {
        NetworkManager.shared.completeChallenge(challengeId: challenge.id) { success, coinsEarned in
            if success {
                withAnimation(.spring()) {
                    completedChallenges.insert(challenge.id)
                }
            }
        }
    }
}

struct ProgressCard: View {
    let progress: Int
    let goal: Int

    private var progressPercentage: Double {
        min(Double(progress) / Double(goal), 1.0)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Your Progress Today")
                .font(.headline)
                .foregroundColor(.white)

            // Progress Bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.white.opacity(0.1))
                        .frame(height: 20)

                    RoundedRectangle(cornerRadius: 8)
                        .fill(
                            LinearGradient(
                                colors: [Color.cyan, Color.purple],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * progressPercentage, height: 20)
                        .animation(.spring(), value: progressPercentage)
                }
            }
            .frame(height: 20)

            Text("\(progress) of \(goal) coins earned")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.05))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}

struct CategorySection: View {
    let category: String
    let challenges: [Challenge]
    let isExpanded: Bool
    let completedChallenges: Set<String>
    let onToggle: () -> Void
    let onCompleteChallenge: (Challenge) -> Void

    private var categoryIcon: String {
        switch category {
        case "Finance": return "🏦"
        case "Health": return "🏃"
        case "Learning": return "🎓"
        default: return "⭐"
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Category Header
            Button(action: onToggle) {
                HStack {
                    Text(categoryIcon)
                        .font(.title2)

                    Text(category.uppercased())
                        .font(.headline)
                        .foregroundColor(.white)

                    Spacer()

                    HStack(spacing: 8) {
                        Text("\(challenges.count)")
                            .font(.caption)
                            .foregroundColor(.gray)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.1))
                            .cornerRadius(8)

                        Image(systemName: "chevron.right")
                            .foregroundColor(.gray)
                            .rotationEffect(.degrees(isExpanded ? 90 : 0))
                    }
                }
                .padding()
                .background(Color.white.opacity(0.03))
            }

            // Expanded Challenges
            if isExpanded {
                VStack(spacing: 12) {
                    ForEach(challenges) { challenge in
                        ChallengeCard(
                            challenge: challenge,
                            isCompleted: completedChallenges.contains(challenge.id),
                            onComplete: {
                                onCompleteChallenge(challenge)
                            }
                        )
                    }
                }
                .padding()
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .padding(.horizontal)
    }
}

struct ChallengeCard: View {
    let challenge: Challenge
    let isCompleted: Bool
    let onComplete: () -> Void

    private var partnerLogo: String {
        switch challenge.partner {
        case "SoFi": return "🏦"
        case "Fitbit": return "⌚"
        case "Coursera": return "📚"
        default: return "🎯"
        }
    }

    var body: some View {
        HStack(spacing: 16) {
            // Partner Badge
            Text(partnerLogo)
                .font(.title2)
                .frame(width: 50, height: 50)
                .background(
                    Circle()
                        .fill(Color.white.opacity(0.1))
                )

            // Challenge Details
            VStack(alignment: .leading, spacing: 4) {
                Text(challenge.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)

                Text(challenge.description)
                    .font(.caption)
                    .foregroundColor(.gray)
                    .lineLimit(2)

                HStack(spacing: 6) {
                    Image(systemName: "star.circle.fill")
                        .font(.caption)
                        .foregroundColor(.yellow)
                    Text("\(challenge.coinsReward) coins")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.yellow)
                }
            }

            Spacer()

            // Action Button
            Button(action: onComplete) {
                if isCompleted {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(.green)
                } else {
                    Text("Start")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            LinearGradient(
                                colors: [Color.purple, Color.blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(20)
                }
            }
            .disabled(isCompleted)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(
                    isCompleted
                        ? Color.green.opacity(0.1)
                        : Color.white.opacity(0.05)
                )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(
                    isCompleted
                        ? Color.green.opacity(0.3)
                        : Color.white.opacity(0.1),
                    lineWidth: 1
                )
        )
    }
}

struct ComingSoonCard: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("🎯")
                .font(.system(size: 48))

            Text("More Partners Coming Soon!")
                .font(.headline)
                .foregroundColor(.white)

            Text("Duolingo, Peloton, Khan Academy, and more")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.2), Color.blue.opacity(0.2)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(
                    LinearGradient(
                        colors: [Color.purple.opacity(0.5), Color.blue.opacity(0.5)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1
                )
        )
    }
}
#Preview {
    EarnView()
        .environmentObject(UserState.shared)
        .background(Color.black)
        .preferredColorScheme(.dark)
}
