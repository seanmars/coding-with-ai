#!/usr/bin/env node

import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";
import { existsSync, readdirSync, mkdirSync, copyFileSync, statSync } from "fs";
import { join, basename } from "path";
import { homedir } from "os";

interface SddFile {
  name: string;
  sourcePath: string;
  targetPath: string;
  exists: boolean;
}

type Mode =
  | "loading"
  | "checking"
  | "confirming"
  | "installing"
  | "complete"
  | "error";

const InstallSddApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [files, setFiles] = useState<SddFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState<string>("");
  const [installProgress, setInstallProgress] = useState<string>("");
  const [existingFiles, setExistingFiles] = useState<SddFile[]>([]);
  const [newFiles, setNewFiles] = useState<SddFile[]>([]);

  const { exit } = useApp();

  useEffect(() => {
    loadSddFiles();
  }, []);

  const loadSddFiles = async () => {
    try {
      const homeDirectory = homedir();
      const commandsSourceDir = join(
        process.cwd(),
        "claude",
        "spec-driven-development",
        "commands"
      );
      const templatesSourceDir = join(
        process.cwd(),
        "claude",
        "spec-driven-development",
        "templates"
      );
      const commandsTargetDir = join(homeDirectory, ".claude", "commands");
      const templatesTargetDir = join(homeDirectory, ".claude", "templates");

      const allFiles: SddFile[] = [];
      const conflictingFiles: SddFile[] = [];
      const newFiles: SddFile[] = [];

      // Process commands
      if (existsSync(commandsSourceDir)) {
        const commandFiles = readdirSync(commandsSourceDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(commandsSourceDir, file)).isFile()
        );

        for (const file of commandFiles) {
          const sourcePath = join(commandsSourceDir, file);
          const targetPath = join(commandsTargetDir, file);
          const exists = existsSync(targetPath);

          const sddFile: SddFile = {
            name: `commands/${basename(file, ".md")}`,
            sourcePath,
            targetPath,
            exists,
          };

          allFiles.push(sddFile);
          if (exists) {
            conflictingFiles.push(sddFile);
          } else {
            newFiles.push(sddFile);
          }
        }
      }

      // Process templates
      if (existsSync(templatesSourceDir)) {
        const templateFiles = readdirSync(templatesSourceDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(templatesSourceDir, file)).isFile()
        );

        for (const file of templateFiles) {
          const sourcePath = join(templatesSourceDir, file);
          const targetPath = join(templatesTargetDir, file);
          const exists = existsSync(targetPath);

          const sddFile: SddFile = {
            name: `templates/${basename(file, ".md")}`,
            sourcePath,
            targetPath,
            exists,
          };

          allFiles.push(sddFile);
          if (exists) {
            conflictingFiles.push(sddFile);
          } else {
            newFiles.push(sddFile);
          }
        }
      }

      if (allFiles.length === 0) {
        setError("No SDD files found in source directories");
        setMode("error");
        return;
      }

      setFiles(allFiles);
      setExistingFiles(conflictingFiles);
      setNewFiles(newFiles);

      if (conflictingFiles.length > 0) {
        setSelectedIndex(1);
        setMode("checking");
      } else {
        setSelectedIndex(0);
        setMode("confirming");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setMode("error");
    }
  };

  const performInstallation = async () => {
    setMode("installing");

    try {
      const homeDirectory = homedir();
      const commandsTargetDir = join(homeDirectory, ".claude", "commands");
      const templatesTargetDir = join(homeDirectory, ".claude", "templates");

      // Ensure target directories exist
      if (!existsSync(commandsTargetDir)) {
        mkdirSync(commandsTargetDir, { recursive: true });
      }
      if (!existsSync(templatesTargetDir)) {
        mkdirSync(templatesTargetDir, { recursive: true });
      }

      setInstallProgress("Preparing installation...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Copy files
      for (const file of files) {
        setInstallProgress(`Installing ${file.name}...`);
        copyFileSync(file.sourcePath, file.targetPath);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setInstallProgress("Installation complete!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMode("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Installation failed");
      setMode("error");
    } finally {
      setTimeout(() => exit(), 1500);
    }
  };

  useInput((input, key) => {
    if (mode === "loading" || mode === "installing") return;

    if (key.escape) {
      exit();
      return;
    }

    switch (mode) {
      case "checking":
      case "confirming":
        if (key.upArrow || key.downArrow) {
          setSelectedIndex(selectedIndex === 0 ? 1 : 0);
        } else if (key.return) {
          if (selectedIndex === 0) {
            performInstallation();
          } else {
            exit();
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
            <Text>Loading SDD files...</Text>
          </Box>
        );

      case "checking":
        return (
          <Box flexDirection="column">
            <Text bold color="yellow">
              ⚠️ Existing Files Detected
            </Text>
            <Text> </Text>
            <Text>
              The following files already exist and will be overwritten:
            </Text>
            <Text> </Text>
            {existingFiles.map((file) => (
              <Text key={file.name} color="red">
                🗞️ {file.name}
              </Text>
            ))}
            {newFiles.length > 0 && (
              <>
                <Text> </Text>
                <Text>The following new files will be created:</Text>
                <Text> </Text>
              </>
            )}
            {newFiles.map((file) => (
              <Text key={file.name} color="green">
                🗞️ {file.name}
              </Text>
            ))}
            <Text> </Text>
            <Text>Do you want to continue and overwrite these files?</Text>
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "green"}>
              {selectedIndex === 0 ? "▶ " : "  "}Yes, overwrite existing files
            </Text>
            <Text color={selectedIndex === 1 ? "yellow" : "red"}>
              {selectedIndex === 1 ? "▶ " : "  "}Cancel installation
            </Text>
            <Text> </Text>
            <Text color="gray">
              ↑↓ navigate, Enter to select, Esc to cancel
            </Text>
          </Box>
        );

      case "confirming":
        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Install Spec-Driven Development Files
            </Text>
            <Text> </Text>
            <Text>The following {files.length} files will be installed:</Text>
            <Text> </Text>
            {files.map((file) => (
              <Text key={file.name} color="green">
                • {file.name}
              </Text>
            ))}
            <Text> </Text>
            <Text>Do you want to proceed with the installation?</Text>
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "green"}>
              {selectedIndex === 0 ? "▶ " : "  "}Yes, install files
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
              Installing SDD Files...
            </Text>
            <Text> </Text>
            <Text color="yellow">⚙️ {installProgress}</Text>
          </Box>
        );

      case "complete":
        return (
          <Box flexDirection="column">
            <Text color="green" bold>
              ✅ SDD files installed successfully!
            </Text>
            <Text> </Text>
            <Text color="gray">Commands installed to: ~/.claude/commands/</Text>
            <Text color="gray">
              Templates installed to: ~/.claude/templates/
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

export function installSddCommand() {
  render(<InstallSddApp />);
}

installSddCommand();
