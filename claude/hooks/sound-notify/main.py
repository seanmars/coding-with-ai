#!/usr/bin/env python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pygame>=2.0.0",
# ]
# ///
"""
Sound notification for Claude Code Hook

Usage:
  uv run main.py --sound <sound_name>

Place your audio files in the "sounds" folder next to this script.
Uses pygame for direct audio playback without opening external programs.
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import Optional, Iterable
import os

logging.basicConfig(level=logging.INFO)

ALLOWED_EXTS = [
    ".wav",
    # Other formats may require extra dependencies/tools on your OS
    ".mp3",
    ".ogg",
    ".m4a",
    ".flac",
]


def find_sound_file(sounds_dir: Path, name: str) -> Optional[Path]:
    """Find a sound file by name within sounds_dir.

    Rules:
    - If name is a path and exists, return it.
    - Otherwise, match by file stem (case-insensitive) across ALLOWED_EXTS.
    - If name includes an extension, try direct match first.
    """
    # Absolute or relative path provided
    candidate = Path(name)
    if candidate.is_file():
        return candidate

    # Ensure sounds directory exists
    if not sounds_dir.exists():
        return None

    name_lower = name.lower()

    # If the user provided an extension, try direct child match
    if "." in name and (sounds_dir / name).is_file():
        return sounds_dir / name

    # Try to find by stem across allowed extensions
    for ext in ALLOWED_EXTS:
        p = sounds_dir / f"{name}{ext}"
        if p.is_file():
            return p

    # Fallback: scan directory and match stems case-insensitively
    for p in sounds_dir.iterdir():
        if p.is_file() and p.suffix.lower() in ALLOWED_EXTS:
            if p.stem.lower() == name_lower:
                return p

    return None


def list_available_sounds(sounds_dir: Path) -> Iterable[str]:
    if not sounds_dir.exists():
        return []
    return sorted({p.stem for p in sounds_dir.iterdir() if p.is_file() and p.suffix.lower() in ALLOWED_EXTS})


def play_sound(filepath: Path) -> None:
    """Play the given sound file directly without opening external programs.
    
    Uses pygame for audio playback to avoid opening system default apps.
    Falls back to winsound on Windows for WAV files if pygame fails.
    """
    try:
        import pygame
        pygame.mixer.init()
        pygame.mixer.music.load(str(filepath))
        pygame.mixer.music.play()
        
        # Wait for playback to complete
        while pygame.mixer.music.get_busy():
            pygame.time.wait(100)
        
        pygame.mixer.quit()
        logging.info("Sound played successfully with pygame")
        
    except Exception as e:
        logging.warning("pygame playback failed: %s", e)
        
        # Fallback to winsound for WAV on Windows
        suffix = filepath.suffix.lower()
        if os.name == "nt" and suffix == ".wav":
            try:
                import winsound
                winsound.PlaySound(str(filepath), winsound.SND_FILENAME)
                logging.info("Sound played with winsound fallback")
                return
            except Exception as fallback_e:
                logging.error("winsound fallback also failed: %s", fallback_e)
        
        # Last resort beep on Windows
        if os.name == "nt":
            try:
                import winsound
                winsound.MessageBeep()
                logging.info("Played system beep as last resort")
            except Exception:
                pass


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Play a sound by name from the sounds folder")
    parser.add_argument("--sound", "-s", required=False, help="Sound name (file stem) or path to file")
    parser.add_argument("--list", action="store_true", help="List available sounds and exit")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None):
    args = parse_args(argv if argv is not None else sys.argv[1:])

    script_dir = Path(__file__).resolve().parent
    sounds_dir = script_dir / "sounds"

    if args.list:
        names = list(list_available_sounds(sounds_dir))
        if names:
            logging.info("Available sounds: %s", ", ".join(names))
        else:
            logging.info("No sounds found. Add files to: %s", sounds_dir)
        return

    if not args.sound:
        logging.error("Missing --sound. Use --list to see available sounds.")
        sys.exit(2)

    target = find_sound_file(sounds_dir, args.sound)
    if not target:
        logging.error("Sound '%s' not found under %s", args.sound, sounds_dir)
        avail = list(list_available_sounds(sounds_dir))
        if avail:
            logging.info("Available: %s", ", ".join(avail))
        else:
            logging.info("No sounds available. Place a WAV file in %s and re-run.", sounds_dir)
        # As a minimal cue, emit a beep on Windows
        if os.name == "nt":
            try:
                import winsound
                winsound.MessageBeep()
            except Exception:
                pass
        sys.exit(1)

    logging.info("Playing: %s", target)
    play_sound(target)


if __name__ == "__main__":
    main()
