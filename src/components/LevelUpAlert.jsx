import React from 'react'
import { Zap } from 'lucide-react'

export default function LevelUpAlert({ level }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="absolute inset-0 bg-neon-purple/10 backdrop-blur-sm"></div>
      <div className="relative bg-dark-card border-2 border-neon-purple rounded-3xl p-8 text-center shadow-2xl animate-bounce-in max-w-xs mx-4">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-3xl blur-xl"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
            <Zap size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extra-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-2">LEVEL UP!</h2>
          <p className="text-lg font-bold text-white">Nível {level}</p>
          <p className="text-sm text-white/60 mt-2">Parabéns! Continue assim! 🎉</p>
        </div>
      </div>
    </div>
  )
}
