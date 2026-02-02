from abc import ABC, abstractmethod
from typing import Optional
from domain.models import TranscriptionResult


class ITranscriber(ABC):
    @abstractmethod
    def transcribe(self, audio_file_path: str, audio_file_id: str, language: Optional[str] = None) -> TranscriptionResult:
        """Transcribes audio file at given path."""
        raise NotImplementedError()
