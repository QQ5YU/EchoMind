import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Slider } from 'primereact/slider'
import { SpeedControl } from './SpeedControl'

interface AudioPlayerProps {
  currentTime: number
  duration: number
  isPlaying: boolean
  onPlayPause: () => void
  onSeek: (time: number) => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentTime, duration, isPlaying, onPlayPause, onSeek }) => {
  const [speed, setSpeed] = useState(1.0)

  return (
    <div className="w-80 flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-8 border border-transparent dark:border-gray-700">
        <div className="flex items-center justify-center mb-8">
          <div className="w-40 h-40 bg-indigo-50 dark:bg-indigo-900/50 rounded-3xl flex items-center justify-center shadow-inner dark:shadow-none">
            <i className="pi pi-file-audio text-6xl text-indigo-200 dark:text-indigo-400" />
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="flex flex-col gap-3">
            <Slider value={currentTime} onChange={(e) => onSeek(e.value as number)} max={duration} className="w-full" />
            <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
              <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button icon="pi pi-replay" className="p-button-rounded p-button-text p-button-secondary dark:text-gray-300" />
            <Button 
              icon={isPlaying ? "pi pi-pause" : "pi pi-play"} 
              className="p-button-rounded p-button-lg shadow-lg bg-indigo-500 border-none hover:bg-indigo-600 text-white" 
              onClick={onPlayPause} 
            />
            <Button icon="pi pi-forward" className="p-button-rounded p-button-text p-button-secondary dark:text-gray-300" />
          </div>

          <SpeedControl currentSpeed={speed} onChange={setSpeed} />
        </div>
      </div>
    </div>
  )
}
