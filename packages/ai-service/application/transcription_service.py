from typing import Optional, Dict, Any
from domain.interfaces import ITranscriber
from domain.models import TranscriptionResult
from utils.logger import get_logger

logger = get_logger("TranscriptionApplicationService")


class TranscriptionApplicationService:
    def __init__(self, transcriber: ITranscriber) -> None:
        self.transcriber = transcriber

    def execute(self, audio_file_path: Optional[str], audio_file_id: Optional[str], language: Optional[str] = None) -> Dict[str, Any]:
        """Orchestrates the transcription process and returns a JSON-serializable dict.

        Accepts Optional inputs (validated at runtime).
        """
        if not audio_file_path or not audio_file_id:
            raise ValueError("audio_file_path and audio_file_id are required")
        logger.info(f"Executing transcription use case for file {audio_file_id}")

        try:
            result: TranscriptionResult = self.transcriber.transcribe(audio_file_path, audio_file_id, language)

            return {
                "transcript_id": "gen-uuid-placeholder",
                "language": result.language,
                "segments": [
                    {"text": s.text, "start": s.start, "end": s.end} for s in result.segments
                ],
            }
        except Exception:
            logger.exception("Error in transcription service")
            raise
