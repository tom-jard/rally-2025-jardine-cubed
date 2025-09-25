import SwiftUI

struct ContentView: View {
    @EnvironmentObject var userState: UserState
    @State private var showSettings = false

    var body: some View {
        NavigationView {
            GamesView()
                .navigationBarTitleDisplayMode(.large)
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button(action: {
                            showSettings = true
                        }) {
                            Image(systemName: "person.circle")
                                .font(.title3)
                                .foregroundColor(.secondary)
                        }
                    }

                    ToolbarItem(placement: .navigationBarTrailing) {
                        HeaderView()
                    }
                }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .sheet(isPresented: $showSettings) {
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
                            showSettings = false
                        }
                    }
                }
            }
            .environmentObject(userState)
        }
    }
}

struct HeaderView: View {
    @EnvironmentObject var userState: UserState

    var body: some View {
        // Daruma Balance
        HStack(spacing: 6) {
            Text("🪆")
                .font(.headline)

            Text("\(userState.coinBalance)")
                .font(.headline)
                .fontWeight(.semibold)
                .animation(.spring(), value: userState.coinBalance)
        }
    }
}

// Removed tab bar components since we're focusing only on Games

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(UserState.shared)
            .environmentObject(DeepLinkManager.shared)
            .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
        .environmentObject(UserState.shared)
        .environmentObject(DeepLinkManager.shared)
        .preferredColorScheme(.dark)
}