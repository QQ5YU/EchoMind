from typing import List, Optional

from pydantic import BaseModel


class Segment(BaseModel):
    """Represents a single segment of transcribed text."""
    id: int
    text: str
    start: float
    end: float
    # Future: confidence, speaker, etc.


class TranscriptionResult(BaseModel):
    """Represents the complete result of a transcription job."""
    audio_file_id: str
    language: str
    segments: List[Segment]
    duration: float = 0.0
