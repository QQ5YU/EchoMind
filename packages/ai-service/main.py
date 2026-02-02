import sys
import json
import traceback
from pydantic import ValidationError
from utils.logger import get_logger
from infrastructure.asr.faster_whisper_impl import FasterWhisperTranscriber
from application.transcription_service import TranscriptionApplicationService
from application.schemas import TranscribePayload, Message, ResponseModel

logger = get_logger("Main")


def main() -> None:
    logger.info("AI Service starting...")

    try:
        transcriber = FasterWhisperTranscriber(model_size="base")
        transcription_service = TranscriptionApplicationService(transcriber)

        logger.info("AI Service initialized and ready.")
    except Exception as e:
        logger.critical(f"Failed to initialize AI Service: {e}")
        sys.exit(1)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            raw = json.loads(line)
            try:
                message = Message.model_validate(raw)
            except ValidationError as ve:
                logger.error(f"Invalid message format: {ve}")
                continue

            msg_type = message.type
            request_id = message.request_id
            payload = message.payload or {}

            response = ResponseModel(request_id=request_id)

            if msg_type == "transcribe":
                try:
                    # validate payload for transcribe
                    trans_payload = TranscribePayload.model_validate(payload)
                    result = transcription_service.execute(
                        audio_file_path=trans_payload.audio_file_path,
                        audio_file_id=trans_payload.audio_file_id,
                        language=trans_payload.language,
                    )

                    response.type = "transcribe_response"
                    response.status = "success"
                    response.payload = result or {}

                except Exception as app_error:
                    response.payload = {"message": str(app_error)}

            elif msg_type == "search":
                response.type = "search_response"
                response.payload = {"message": "Search not implemented yet"}
            else:
                response.payload = {"message": f"Unknown message type: {msg_type}"}

            # Send response to stdout
            print(response.model_dump_json(), flush=True)

        except json.JSONDecodeError:
            logger.error(f"Failed to decode local JSON: {line}")
        except Exception as e:
            logger.error(f"Critical error in loop: {e}")
            logger.error(traceback.format_exc())


if __name__ == "__main__":
    main()
