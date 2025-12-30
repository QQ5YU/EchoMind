import React from 'react'

interface SpeedControlProps {
  currentSpeed: number
  onChange: (speed: number) => void
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ currentSpeed, onChange }) => {
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
  
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Speed</span>
      <select 
        value={currentSpeed}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="bg-gray-50 border-none rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none dark:bg-gray-700 dark:text-gray-200"
      >
        {speeds.map(speed => (
          <option key={speed} value={speed}>{speed}x</option>
        ))}
      </select>
    </div>
  )
}
