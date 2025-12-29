import React, { useState } from 'react'
import { Layout } from '@shared/ui/Layout'
import { Button } from 'primereact/button'
import { TranscriptViewer, TranscriptSegment } from '@features/playback/components/TranscriptViewer'
import { AudioPlayer } from '@features/playback/components/AudioPlayer'

export const PlaybackPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // Mock transcript segments
  const segments: TranscriptSegment[] = [
    { start: 0, text: "Welcome to this recording about EchoMind." },
    { start: 5, text: "In this session, we will demonstrate the semantic search capabilities." },
    { start: 12, text: "Users can find specific moments in their audio files very easily." },
    { start: 18, text: "Clicking on any part of this text will jump the audio to that position." }
  ]

  return (
    <Layout>
      <div className="flex flex-col h-full max-w-6xl mx-auto gap-6">
        <header className="flex items-center justify-between">
          <div>
            <Button 
              icon="pi pi-arrow-left" 
              className="p-button-text mb-2" 
              label="Back to Files" 
              onClick={() => window.history.back()}
            />
            <h1 className="text-2xl font-bold">Meeting_Notes_1.mp3</h1>
          </div>
          <Button label="Export Transcript" icon="pi pi-download" severity="secondary" />
        </header>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <TranscriptViewer 
            segments={segments} 
            currentTime={currentTime} 
            onSegmentClick={setCurrentTime} 
          />

          <AudioPlayer 
            currentTime={currentTime} 
            duration={30} 
            isPlaying={isPlaying} 
            onPlayPause={() => setIsPlaying(!isPlaying)} 
            onSeek={setCurrentTime} 
          />
        </div>
      </div>
    </Layout>
  )
}