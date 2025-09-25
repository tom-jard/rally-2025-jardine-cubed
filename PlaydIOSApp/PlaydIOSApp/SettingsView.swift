import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var userState: UserState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .font(.largeTitle)
                            .foregroundColor(.blue)

                        VStack(alignment: .leading) {
                            Text("Player")
                                .font(.headline)
                            Text("Daruma Collector")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }

                        Spacer()
                    }
                    .padding(.vertical, 8)
                }

                Section("Balance") {
                    HStack {
                        Text("🪆")
                            .font(.title2)
                        Text("Darumas")
                        Spacer()
                        Text("\(userState.coinBalance)")
                            .font(.headline)
                            .fontWeight(.semibold)
                    }
                }

                Section("App Info") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Build")
                        Spacer()
                        Text("2025.09.25")
                            .foregroundColor(.secondary)
                    }
                }

                Section("Support") {
                    Button(action: {}) {
                        HStack {
                            Image(systemName: "questionmark.circle")
                            Text("Help & FAQ")
                        }
                    }

                    Button(action: {}) {
                        HStack {
                            Image(systemName: "envelope")
                            Text("Contact Support")
                        }
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(UserState.shared)
}