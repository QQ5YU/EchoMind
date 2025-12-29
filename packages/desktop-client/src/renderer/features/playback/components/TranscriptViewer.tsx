import React from 'react'

export interface TranscriptSegment {
  start: number
  text: string
}

interface TranscriptViewerProps {
  segments: TranscriptSegment[]
  currentTime: number
  onSegmentClick: (time: number) => void
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ segments, currentTime, onSegmentClick }) => {
  return (
    <div className="flex-1 bg-white shadow-sm rounded-2xl p-8 overflow-auto">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Transcript</h2>
      <div className="space-y-6">
        {segments.map((seg, idx) => (
          <p 
            key={idx} 
            className={`p-3 rounded-xl cursor-pointer transition-all ${
              currentTime >= seg.start && (idx === segments.length - 1 || currentTime < segments[idx + 1].start)
                ? 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-100'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => onSegmentClick(seg.start)}
          >
            <span className="text-xs font-mono text-indigo-400 mr-4 opacity-70">
              {Math.floor(seg.start / 60)}:{(seg.start % 60).toString().padStart(2, '0')}
            </span>
            <span className="leading-relaxed">{seg.text}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
