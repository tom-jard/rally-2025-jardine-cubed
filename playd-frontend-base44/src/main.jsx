import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Play'd
          </h1>
          <p className="text-2xl mb-8 text-purple-300">
            Turning Playtime into Paytime
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">🎉 Hackathon Demo Ready!</h2>
            <p className="text-lg text-gray-300 mb-6">
              Complete financial gaming platform with real Plaid integration, 
              AI photo analysis, and gamified rewards system.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-green-500/20 p-4 rounded-lg">
                <h3 className="font-bold text-green-300">✅ Features Ready</h3>
                <ul className="text-left mt-2 space-y-1">
                  <li>🏦 Real Plaid Banking</li>
                  <li>🌱 Touch Grass AI Analysis</li>
                  <li>🧠 Educational Quizzes</li>
                  <li>🎯 Real-time Daruma Updates</li>
                </ul>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <h3 className="font-bold text-blue-300">🛠 Tech Stack</h3>
                <ul className="text-left mt-2 space-y-1">
                  <li>⚛️ React + Vite</li>
                  <li>🟢 Node.js + Express</li>
                  <li>🏦 Plaid SDK</li>
                  <li>🎨 Tailwind CSS</li>
                </ul>
              </div>
            </div>
            <p className="text-yellow-300 mt-6 font-semibold">
              🦫 Ready to impress hackathon judges!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
