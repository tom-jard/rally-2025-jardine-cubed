
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Gamepad2, Star } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Earn", path: createPageUrl("Earn"), icon: Star },
    // { name: "Games", path: createPageUrl("Games"), icon: Gamepad2 }, // Hidden as requested
  ];
  
  const showNav = currentPageName !== 'Home';

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased">
      <style>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-gradient {
          background: linear-gradient(-45deg, #1e0033, #3c004a, #5a005a, #0d1a4a);
          background-size: 400% 400%;
          animation: gradient-animation 25s ease infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-nav {
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-item-active {
            color: #c084fc; /* A nice purple for active state */
        }
      `}</style>
      
      <div className="animated-gradient fixed inset-0 z-[-1]" />
      
      <main className={`px-4 sm:px-6 lg:px-8 ${showNav ? 'pb-24' : ''}`}>
        {children}
      </main>
      
      {showNav && (
        <footer className="glass-nav fixed bottom-0 left-0 right-0 h-20 z-50">
          <nav className="flex justify-around items-center h-full max-w-md mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${
                  location.pathname === item.path ? "nav-item-active" : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </footer>
      )}
    </div>
  );
}
