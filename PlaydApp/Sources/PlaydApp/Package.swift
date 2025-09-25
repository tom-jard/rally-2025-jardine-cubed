// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "PlaydApp",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "PlaydApp",
            targets: ["PlaydApp"]),
    ],
    targets: [
        .target(
            name: "PlaydApp",
            dependencies: [])
    ]
)