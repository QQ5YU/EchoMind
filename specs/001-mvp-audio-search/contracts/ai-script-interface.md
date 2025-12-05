# AI Script Interface Contract

This document defines the command-line interface and I/O contract for the external Python script responsible for AI processing (transcription and vectorization). This script is treated as a black box; the Node.js application is only concerned with this interface.

As per the user request, the implementation of this AI script is **out of scope** for the current plan.

## Invocation

The script will be invoked by the Electron Main process using `child_process.spawn`.

-   **Command**: `python`
-   **Script Path**: `[path-to-python-script]/process_audio.py`

## Command-Line Arguments

The script accepts the following command-line arguments:

-   `--audio-file-path` (required): The absolute path to the audio file that needs to be processed.
-   `--output-dir` (required): The absolute path to the directory where output files (transcript, vectors) should be stored.
-   `--language` (optional): The language of the audio file (e.g., "en", "es"). If not provided, the script should attempt to auto-detect the language.

### Example Invocation

```bash
python process_audio.py \
  --audio-file-path "/workspaces/EchoMind/data/audio/some-file.mp3" \
  --output-dir "/workspaces/EchoMind/data/processed/some-file-id" \
  --language "en"
```

## Standard Output (stdout)

The script MUST output a single JSON object to `stdout` upon successful completion. This JSON object represents the structured transcript data.

-   **Success Output**: A JSON object with the following structure:
    ```json
    {
      "language": "en",
      "segments": [
        {
          "id": "segment-uuid-1",
          "text": "This is the first sentence.",
          "start_time": 0,
          "end_time": 3
        },
        {
          "id": "segment-uuid-2",
          "text": "This is the second sentence.",
          "start_time": 4,
          "end_time": 7
        }
      ]
    }
    ```

## Standard Error (stderr)

-   Any errors that occur during processing MUST be written to `stderr`.
-   The Node.js process will listen for any output on `stderr` to mark the processing job as failed.

## Generated Artifacts (in `output-dir`)

Upon successful execution, the script is expected to create the following files inside the provided `--output-dir`:

-   `vectors.db`: A file-based vector store (e.g., a FAISS index or LanceDB table) containing the vector embeddings for each segment. The keys/IDs in this store must match the `id` field of the segments in the JSON output.
