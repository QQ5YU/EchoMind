from typing import List, Optional
import os
import time

from faster_whisper import WhisperModel  # type: ignore

from domain.interfaces import ITranscriber
from domain.models import TranscriptionResult, Segment
from utils.logger import get_logger

logger = get_logger("FasterWhisperTranscriber")


class FasterWhisperTranscriber(ITranscriber):
    def __init__(self, model_size: str = "tiny", device: str = "cpu", compute_type: str = "int8") -> None:
        """Initializes the Whisper model."""
        logger.info(f"Loading Whisper model: {model_size} on {device}...")
        try:
            self.model: WhisperModel = WhisperModel(model_size, device=device, compute_type=compute_type)
            logger.info("Whisper model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            raise

    def transcribe(self, audio_file_path: str, audio_file_id: str, language: Optional[str] = None) -> TranscriptionResult:
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

        logger.info(f"Starting transcription for {audio_file_path}...")
        start_time = time.time()

        # Run transcription (beam_size=5 for a balance of accuracy)
        segments_generator, info = self.model.transcribe(
            audio_file_path,
            beam_size=5,
            language=language,
        )

        # Convert generator to list and map to Domain Models
        domain_segments: List[Segment] = []
        for segment in segments_generator:
            domain_segments.append(Segment(
                id=int(segment.id),
                text=str(segment.text),
                start=float(segment.start),
                end=float(segment.end),
            ))

        total_duration = time.time() - start_time
        detected_language = getattr(info, "language", None)
        info_duration = getattr(info, "duration", total_duration)
        logger.info(f"Transcription complete. Detected language: {detected_language}. Duration: {total_duration:.2f}s")

        return TranscriptionResult(
            audio_file_id=audio_file_id,
            language=detected_language or "",
            segments=domain_segments,
            duration=float(info_duration),
        )
