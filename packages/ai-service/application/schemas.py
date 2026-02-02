from typing import Dict, Any, Optional
from pydantic import BaseModel


class TranscribePayload(BaseModel):
    audio_file_path: Optional[str] = None
    audio_file_id: Optional[str] = None
    language: Optional[str] = None


class Message(BaseModel):
    type: str
    request_id: Optional[str] = None
    payload: Dict[str, Any] = {}


class ResponseModel(BaseModel):
    request_id: Optional[str] = None
    type: Optional[str] = None
    status: str = "error"
    payload: Dict[str, Any] = {}
