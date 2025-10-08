#!/usr/bin/env python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "plyer>=2.1.0",
# ]
# ///

import sys
import argparse
import logging
from typing import Optional
from plyer import notification

logging.basicConfig(level=logging.INFO)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Send a notification to user")
    parser.add_argument("--title", "-t", required=False,
                        help="Title to display in the notification")
    parser.add_argument("--message", "-m", required=False,
                        help="Message to display in the notification")
    return parser.parse_args(argv)


def send_notification(
    title: str,
    message: str,
    app_name: str = "Notification",
    app_icon: Optional[str] = None
) -> None:
    """
    Send an OS notification with customizable content.

    Args:
        title: The notification title
        message: The notification message content
        timeout: How long the notification stays visible (seconds)
        app_name: The application name to display
        app_icon: Path to icon file (optional)
    """
    try:
        notification.notify(
            title=title,
            message=message,
            timeout=0,
            app_name=app_name,
            app_icon=app_icon
        )
    except Exception as e:
        print(f"Failed to send notification: {e}")


def main(argv: list[str] | None = None):
    args = parse_args(argv if argv is not None else sys.argv[1:])
    send_notification(
        title=args.title if args.title else "",
        message=args.message if args.message else "",
        app_name="Notify"
    )


if __name__ == "__main__":
    main()
