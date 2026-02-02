import sys
import logging

def get_logger(name: str) -> logging.Logger:
    """
    Configures a logger that writes to stderr.
    Writing to stdout is forbidden as it is used for IPC.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stderr)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger
