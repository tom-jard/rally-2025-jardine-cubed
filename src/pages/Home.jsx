import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Gamepad2, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col justify-center items-center text-center pt-10 pb-28">
      <motion.div 
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        <motion.div 
          className="glass-card rounded-3xl p-6 mb-8 inline-block"
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-5xl font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>P</span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4"
          style={{ textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          Play'd
        </motion.h1>
        
        <motion.p 
          className="text-2xl md:text-3xl text-purple-300 font-semibold mb-8"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          Turning Playtime into Paytime
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          <Link to={createPageUrl("Earn")}>
            <Button className="glass-card bg-purple-600/80 hover:bg-purple-700/80 text-white px-8 py-6 text-lg font-semibold rounded-2xl border border-purple-400/50 flex items-center gap-2 w-full sm:w-auto">
              <Star className="w-6 h-6" />
              Start Earning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <Link to={createPageUrl("Games")}>
            <Button variant="outline" className="glass-card border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-2xl flex items-center gap-2 w-full sm:w-auto">
              <Gamepad2 className="w-6 h-6" />
              Browse Rewards
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}