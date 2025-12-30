import React from "react";

export interface TranscriptSegment {
  start: number;
  text: string;
}

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSegmentClick: (time: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  currentTime,
  onSegmentClick,
}) => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-8 overflow-auto border border-transparent dark:border-gray-700">
      <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
        Transcript
      </h2>
      <div className="space-y-6">
        {segments.map((seg, idx) => (
          <p
            key={idx}
            className={`p-3 rounded-xl cursor-pointer transition-all ${
              currentTime >= seg.start &&
              (idx === segments.length - 1 ||
                currentTime < segments[idx + 1].start)
                ? "bg-indigo-50 text-indigo-900 ring-1 ring-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-200 dark:ring-indigo-800"
                : "hover:bg-gray-50 text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
            }`}
            onClick={() => onSegmentClick(seg.start)}
          >
            <span className="text-xs font-mono text-indigo-400 dark:text-indigo-300 mr-4 opacity-70">
              {Math.floor(seg.start / 60)}:
              {(seg.start % 60).toString().padStart(2, "0")}
            </span>
            <span className="leading-relaxed">{seg.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
};
