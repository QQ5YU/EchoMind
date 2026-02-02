import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAudioPlayer, usePlaybackData } from "@features/playback";
import { getAudioStreamUrl } from "@renderer/entities/audio";
import { PlaybackView } from "./ui/PlaybackView";

export const PlaybackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { fileName, segments } = usePlaybackData(id);
  const { isPlaying, currentTime, duration, togglePlay, seek } = useAudioPlayer(
    id ? getAudioStreamUrl(id) : undefined,
  );

  const handleBack = useCallback(() => navigate(-1), [navigate]);
  const handleExport = useCallback(() => {
    console.log("Export functionality not implemented yet");
  }, []);

  return (
    <PlaybackView
      fileName={fileName}
      segments={segments}
      playerState={{
        isPlaying,
        currentTime,
        duration,
      }}
      actions={{
        onBack: handleBack,
        onTogglePlay: togglePlay,
        onSeek: seek,
        onExport: handleExport,
      }}
    />
  );
};
