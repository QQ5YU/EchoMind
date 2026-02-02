import React from "react";
import { MainLayout } from "@shared/ui";
import { UserMenu } from "@widgets/UserMenu";
import { Button } from "primereact/button";
import { TranscriptViewer, AudioPlayer } from "@features/playback";
import { TranscriptSegment } from "@renderer/entities/transcript";

interface PlaybackViewProps {
  fileName: string;
  segments: TranscriptSegment[];
  playerState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
  actions: {
    onBack: () => void;
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onExport: () => void;
  };
}

export const PlaybackView: React.FC<PlaybackViewProps> = ({
  fileName,
  segments,
  playerState,
  actions,
}) => {
  return (
    <MainLayout headerRight={<UserMenu />}>
      <div className="flex flex-col h-full max-w-6xl mx-auto gap-6">
        <header className="flex items-center justify-between">
          <div>
            <Button
              icon="pi pi-arrow-left"
              className="p-button-text mb-2 dark:text-gray-300"
              label="Back to Files"
              onClick={actions.onBack}
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {fileName}
            </h1>
          </div>
          <Button
            label="Export Transcript"
            icon="pi pi-download"
            severity="secondary"
            className="dark:text-white"
            tooltip="Not implemented"
            onClick={actions.onExport}
          />
        </header>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <TranscriptViewer
            segments={segments}
            currentTime={playerState.currentTime}
            onSegmentClick={actions.onSeek}
          />

          <AudioPlayer
            currentTime={playerState.currentTime}
            duration={playerState.duration}
            isPlaying={playerState.isPlaying}
            onPlayPause={actions.onTogglePlay}
            onSeek={actions.onSeek}
          />
        </div>
      </div>
    </MainLayout>
  );
};
