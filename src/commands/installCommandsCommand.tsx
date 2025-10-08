#!/usr/bin/env node

import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";
import {
  existsSync,
  readdirSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  statSync,
} from "fs";
import { join, basename } from "path";
import { homedir } from "os";

import { getConstAppValues } from "../common.js";

enum CommandStatus {
  Existing = "existing",
  Available = "available",
  Both = "both",
  Command = "command",
}

interface Command {
  name: string;
  path: string;
  status: CommandStatus;
  selected: boolean;
}

type Mode =
  | "loading"
  | "selecting"
  | "confirming"
  | "installing"
  | "complete"
  | "error";

const MAX_DISPLAY_ITEMS = 10;

const SetupCommandsApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [error, setError] = useState<string>("");
  const [installProgress, setInstallProgress] = useState<string>("");

  const { exit } = useApp();

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    try {
      const { claudeCodeDir, claudeCodeCommandsDir } = getConstAppValues();
      const availableCommandsDir = join(process.cwd(), "claude", "commands");

      const availableCommands: Command[] = [];
      // Process available commands
      if (existsSync(availableCommandsDir)) {
        // Load available commands
        const availableFiles = readdirSync(availableCommandsDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(availableCommandsDir, file)).isFile()
        );

        // Add available commands
        availableFiles.forEach((file) => {
          const name = basename(file, ".md");
          availableCommands.push({
            name,
            path: join(availableCommandsDir, file),
            status: CommandStatus.Available,
            selected: false,
          });
        });
      }

      // Process existing commands
      if (existsSync(claudeCodeCommandsDir)) {
        // Load existing commands
        const existingFiles = readdirSync(claudeCodeCommandsDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(claudeCodeCommandsDir, file)).isFile()
        );

        existingFiles.forEach((file) => {
          // Check if the command is also available
          const name = basename(file, ".md");
          const availableIndex = availableCommands.findIndex(
            (command) => command.name === name
          );
          if (availableIndex === -1) {
            return;
          }

          availableCommands[availableIndex].selected = true;
          availableCommands[availableIndex].status = CommandStatus.Both;
        });
      }

      const allCommands = [...availableCommands].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Add Save option at the end
      allCommands.push({
        name: "Save",
        path: "",
        status: CommandStatus.Command,
        selected: false,
      });

      setCommands(allCommands);
      setMode("selecting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setMode("error");
    }
  };

  const updateScrollOffset = (newIndex: number) => {
    if (newIndex < scrollOffset) {
      setScrollOffset(newIndex);
    } else if (newIndex >= scrollOffset + MAX_DISPLAY_ITEMS) {
      setScrollOffset(newIndex - MAX_DISPLAY_ITEMS + 1);
    }
  };

  const toggleCommandSelection = (index: number) => {
    if (commands[index].name === "Save") return;

    const newCommands = [...commands];
    newCommands[index].selected = !newCommands[index].selected;
    setCommands(newCommands);
  };

  const confirmInstallation = () => {
    const selectedCommands = commands.filter(
      (command) => command.selected && command.name !== "Save"
    );

    if (selectedCommands.length === 0) {
      setError("No commands selected for installation");
      setMode("error");
      return;
    }

    setSelectedIndex(0);
    setMode("confirming");
  };

  const performInstallation = async () => {
    setMode("installing");

    try {
      const homeDirectory = homedir();
      const targetDir = join(homeDirectory, ".claude", "commands");

      // Ensure target directory exists
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      setInstallProgress("Preparing installation...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get selected and unselected commands
      const selectedCommands = commands.filter(
        (command) => command.selected && command.status !== CommandStatus.Command
      );
      const unselectedExistingCommands = commands.filter(
        (command) => !command.selected && command.status !== CommandStatus.Command
      );

      // Copy selected commands
      for (const command of selectedCommands) {
        setInstallProgress(`Installing ${command.name}...`);
        const targetPath = join(targetDir, `${command.name}.md`);
        copyFileSync(command.path, targetPath);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Remove unselected existing commands
      for (const command of unselectedExistingCommands) {
        setInstallProgress(`Removing ${command.name}...`);
        const targetPath = join(targetDir, `${command.name}.md`);
        if (existsSync(targetPath)) {
          unlinkSync(targetPath);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      setInstallProgress("Installation complete!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMode("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Installation failed");
      setMode("error");
    } finally {
      setTimeout(() => exit(), 1000);
    }
  };

  useInput((input, key) => {
    if (mode === "loading" || mode === "installing") return;

    if (key.escape) {
      if (mode === "confirming") {
        setMode("selecting");
      } else {
        exit();
      }
      return;
    }

    switch (mode) {
      case "selecting":
        const totalItems = commands.length;
        const saveIndex = totalItems - 1;

        if (key.upArrow) {
          const newIndex =
            selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1;
          setSelectedIndex(newIndex);
          updateScrollOffset(newIndex);
        } else if (key.downArrow) {
          const newIndex =
            selectedIndex === totalItems - 1 ? 0 : selectedIndex + 1;
          setSelectedIndex(newIndex);
          updateScrollOffset(newIndex);
        } else if (key.return) {
          if (selectedIndex === saveIndex) {
            confirmInstallation();
          } else {
            toggleCommandSelection(selectedIndex);
          }
        } else if (input === " ") {
          if (selectedIndex !== saveIndex) {
            toggleCommandSelection(selectedIndex);
          }
        }
        break;

      case "confirming":
        if (key.upArrow || key.downArrow) {
          setSelectedIndex(selectedIndex === 0 ? 1 : 0);
        } else if (key.return) {
          if (selectedIndex === 0) {
            performInstallation();
          } else {
            setMode("selecting");
          }
        }
        break;

      case "error":
      case "complete":
        exit();
        break;
    }
  });

  const renderMode = () => {
    switch (mode) {
      case "loading":
        return (
          <Box flexDirection="column">
            <Text>Loading commands...</Text>
          </Box>
        );

      case "selecting":
        const visibleCommands = commands.slice(
          scrollOffset,
          scrollOffset + MAX_DISPLAY_ITEMS
        );
        const saveIndex = commands.length - 1;

        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Setup Claude Commands
            </Text>
            <Text> </Text>
            <Text color="gray">
              Select commands to install (existing commands are pre-selected):
            </Text>
            <Text> </Text>

            {visibleCommands.map((command, index) => {
              const actualIndex = scrollOffset + index;
              const isSelected = selectedIndex === actualIndex;
              const isSaveItem = command.name === "Save";

              return (
                <Text key={actualIndex} color={isSelected ? "yellow" : "white"}>
                  {isSelected ? "▶ " : "  "}
                  {isSaveItem ? (
                    <Text color="green" bold>
                      {command.name}
                    </Text>
                  ) : (
                    <>
                      <Text color={command.selected ? "green" : "white"}>
                        {command.selected ? "[x]" : "[ ]"}
                      </Text>
                      <Text> {command.name}</Text>
                    </>
                  )}
                </Text>
              );
            })}

            {commands.length > MAX_DISPLAY_ITEMS && (
              <Text color="gray">
                Showing {scrollOffset + 1}-
                {Math.min(scrollOffset + MAX_DISPLAY_ITEMS, commands.length)} of{" "}
                {commands.length}
              </Text>
            )}

            <Text> </Text>
            <Text color="gray">
              ↑↓ navigate, Enter to select Save or Space/Enter to toggle command
            </Text>
            <Text color="gray">Esc to cancel</Text>
          </Box>
        );

      case "confirming":
        const selectedCount = commands.filter(
          (command) => command.selected && command.name !== "Save"
        ).length;

        return (
          <Box flexDirection="column">
            <Text bold color="yellow">
              Confirm Installation
            </Text>
            <Text> </Text>
            <Text>
              {selectedCount} command{selectedCount !== 1 ? "s" : ""} will be
              installed/updated.
            </Text>
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "green"}>
              {selectedIndex === 0 ? "▶ " : "  "}Yes, proceed
            </Text>
            <Text color={selectedIndex === 1 ? "yellow" : "red"}>
              {selectedIndex === 1 ? "▶ " : "  "}Cancel
            </Text>
            <Text> </Text>
            <Text color="gray">
              ↑↓ navigate, Enter to select, Esc to cancel
            </Text>
          </Box>
        );

      case "installing":
        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Installing Commands...
            </Text>
            <Text> </Text>
            <Text color="yellow">⚙️ {installProgress}</Text>
          </Box>
        );

      case "complete":
        return (
          <Box flexDirection="column">
            <Text color="green" bold>
              ✅ Commands setup completed successfully!
            </Text>
          </Box>
        );

      case "error":
        return (
          <Box flexDirection="column">
            <Text color="red" bold>
              ❌ Error: {error}
            </Text>
          </Box>
        );

      default:
        return <Text>Unknown mode</Text>;
    }
  };

  return renderMode();
};

export function setupCommandsCommand() {
  render(<SetupCommandsApp />);
}

setupCommandsCommand();