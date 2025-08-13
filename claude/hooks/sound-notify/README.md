# sound-notify

Sound notification for Claude Code Hook.

Place audio files in the `sounds` folder next to `main.py`.
On Windows, WAV files play reliably out of the box. Other formats may open in the default player.

## Usage

List available sounds:

```powershell
python .\main.py --list
```

Play a sound by name (file stem) or path:

```powershell
python .\main.py --sound hi
# or
python .\main.py --sound .\sounds\hi.wav
```
