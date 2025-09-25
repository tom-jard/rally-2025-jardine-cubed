import React from 'react';
import { Activity, Brain, DollarSign, Building, Gamepad2, Crown, Zap, Users } from 'lucide-react';

const AppIcon = ({ iconUrl, appName, size = 48, className = "" }) => {
  const sizeClass = size === 48 ? "w-12 h-12" : size === 32 ? "w-8 h-8" : size === 24 ? "w-6 h-6" : "w-12 h-12";
  
  // If it's a URL, render as image
  if (iconUrl && iconUrl.startsWith('http')) {
    return (
      <img 
        src={iconUrl} 
        alt={appName} 
        className={`${sizeClass} rounded-lg object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }
  
  // Custom logo components based on identifier
  switch (iconUrl) {
    case 'apple-health':
      return (
        <div className={`${sizeClass} bg-white rounded-lg flex items-center justify-center ${className}`}>
          <div className="w-4/5 h-4/5 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl">❤️</span>
          </div>
        </div>
      );
      
    case 'first-platypus-bank':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-white font-bold text-2xl">🦫</span>
        </div>
      );
      
    case 'self-learning':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center ${className}`}>
          <Brain className="w-2/3 h-2/3 text-white" />
        </div>
      );
      
    case 'fidelity':
      return (
        <div className={`${sizeClass} bg-green-600 rounded-lg flex items-center justify-center ${className}`}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
            {/* Fidelity pyramid/starburst design */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            </div>
            {/* Radiating lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-px h-3 bg-green-600"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: 'center',
                  top: '8px',
                  left: '50%',
                  marginLeft: '-0.5px'
                }}
              />
            ))}
          </div>
        </div>
      );
      
    case 'candy-crush':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-white font-bold text-2xl">🍭</span>
        </div>
      );
      
    case 'clash-of-clans':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-white font-bold text-2xl">⚔️</span>
        </div>
      );
      
    case 'roblox':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center ${className}`}>
          <Users className="w-2/3 h-2/3 text-white" />
        </div>
      );
      
    case 'royal-match':
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg flex items-center justify-center ${className}`}>
          <Crown className="w-2/3 h-2/3 text-white" />
        </div>
      );
      
    default:
      return (
        <div className={`${sizeClass} bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center ${className}`}>
          <Gamepad2 className="w-2/3 h-2/3 text-white" />
        </div>
      );
  }
};

export default AppIcon;
