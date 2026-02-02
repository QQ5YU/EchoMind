import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "@renderer/shared/utils/logger";

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface AudioPlayerControls {
  togglePlay: () => void;
  seek: (time: number) => void;
}

export const useAudioPlayer = (src?: string) => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const updateState = (partial: Partial<AudioPlayerState>) =>
      setState((prev) => ({ ...prev, ...partial }));

    const handleTimeUpdate = () =>
      updateState({ currentTime: audio.currentTime });
    const handleLoadedMetadata = () =>
      updateState({ duration: audio.duration });
    const handleEnded = () => updateState({ isPlaying: false });
    const handlePlay = () => updateState({ isPlaying: true });
    const handlePause = () => updateState({ isPlaying: false });

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
    }
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(logger.error);
    }
  }, [state.isPlaying]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  return { ...state, togglePlay, seek };
};
