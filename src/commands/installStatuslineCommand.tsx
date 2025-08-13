#!/usr/bin/env node

import React, { useState, useEffect } from "react";
import { render, Text, Box, useApp } from "ink";
import SelectInput from "ink-select-input";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  readFileSync,
} from "fs";
import { join } from "path";
import { homedir } from "os";

interface StatuslineConfig {
  type: string;
  command: string;
  padding: number;
}

interface SettingsConfig {
  statusLine: StatuslineConfig;
  [key: string]: any; // Allow additional properties
}

const defaultSettings: SettingsConfig = {
  statusLine: {
    type: "command",
    command: "node ~/.claude/statusline.js",
    padding: 0,
  },
};

const defaultScriptFile = "statusline.js";
const delayTime = 200;

interface ConfirmationProps {
  message: string;
  onAnswer: (answer: boolean) => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ message, onAnswer }) => {
  const items = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];

  const handleSelect = (item: { label: string; value: boolean }) => {
    onAnswer(item.value);
  };

  return (
    <Box flexDirection="column">
      <Text color="yellow">⚠️ {message}</Text>
      <Text> </Text>
      <SelectInput items={items} onSelect={handleSelect} initialIndex={1} />
    </Box>
  );
};

interface InstallProgressProps {
  onComplete: (success: boolean, error?: string) => void;
}

const InstallProgress: React.FC<InstallProgressProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Checking directories...",
    "Creating .claude directory...",
    "Copying statusline.js...",
    "Writing settings.json...",
    "Installation complete!",
  ];

  useEffect(() => {
    const performInstallation = async () => {
      try {
        const homeDirectory = homedir();
        const claudeDirectory = join(homeDirectory, ".claude");
        const settingsFile = join(claudeDirectory, "settings.json");

        // Step 1: Check directories
        setCurrentStep(1);
        await new Promise((resolve) => setTimeout(resolve, delayTime));

        // Step 2: Create .claude directory if it doesn't exist
        setCurrentStep(2);
        if (!existsSync(claudeDirectory)) {
          mkdirSync(claudeDirectory, { recursive: true });
        }
        await new Promise((resolve) => setTimeout(resolve, delayTime));

        // Step 3: Find and copy the built statusline.js file
        setCurrentStep(3);
        const currentDir = process.cwd();
        const builtFilePath = join(currentDir, "dist", "statusline.js");

        if (!existsSync(builtFilePath)) {
          throw new Error(
            `Built file not found: ${builtFilePath}. Please run 'pnpm build' first.`
          );
        }

        const scriptFilePath = join(claudeDirectory, defaultScriptFile);
        copyFileSync(builtFilePath, scriptFilePath);
        await new Promise((resolve) => setTimeout(resolve, delayTime));

        // Step 4: Write settings.json
        setCurrentStep(4);
        let settings = JSON.parse(
          JSON.stringify(defaultSettings)
        ) as SettingsConfig;
        settings.statusLine.command = `node ${scriptFilePath}`;

        if (existsSync(settingsFile)) {
          const existingSettings = JSON.parse(
            readFileSync(settingsFile, "utf-8")
          ) as SettingsConfig;

          settings = { ...existingSettings, ...settings };
        }

        writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
        await new Promise((resolve) => setTimeout(resolve, delayTime));

        // Step 5: Complete
        setCurrentStep(5);
        await new Promise((resolve) => setTimeout(resolve, delayTime));
        onComplete(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        onComplete(false, errorMessage);
      }
    };

    performInstallation();
  }, [onComplete]);

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">❌ Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        let icon = "⏳";
        let color = "gray";

        if (stepNumber < currentStep) {
          icon = "✅";
          color = "green";
        } else if (stepNumber === currentStep) {
          icon = "⚙️";
          color = "yellow";
        }

        return (
          <Text key={`step-${index}`} color={color}>
            {icon} {step}
          </Text>
        );
      })}
    </Box>
  );
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<
    "checking" | "confirming" | "installing" | "complete" | "cancelled"
  >("checking");
  const [settingsExist, setSettingsExist] = useState(false);
  const [settingsFile, setSettingsFile] = useState("");
  const [installationResult, setInstallationResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const { exit } = useApp();

  useEffect(() => {
    const homeDirectory = homedir();
    const claudeDirectory = join(homeDirectory, ".claude");
    const settingsFilePath = join(claudeDirectory, "settings.json");

    setSettingsFile(settingsFilePath);

    if (existsSync(settingsFilePath)) {
      setSettingsExist(true);
      setPhase("confirming");
    } else {
      setPhase("installing");
    }
  }, []);

  const handleConfirmation = (answer: boolean) => {
    if (answer) {
      setPhase("installing");
    } else {
      setPhase("cancelled");
      setTimeout(() => exit(), 1000);
    }
  };

  const handleInstallationComplete = (success: boolean, error?: string) => {
    setInstallationResult({ success, error });
    setPhase("complete");
    setTimeout(() => exit(), 1000);
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>
        🚀 Claude Code Statusline Installer
      </Text>
      <Text> </Text>

      {phase === "checking" && (
        <Text color="blue">🔍 Checking for existing settings...</Text>
      )}

      {phase === "confirming" && (
        <Confirmation
          message={`Settings file already exists at ${settingsFile}. Overwrite?`}
          onAnswer={handleConfirmation}
        />
      )}

      {phase === "installing" && (
        <InstallProgress onComplete={handleInstallationComplete} />
      )}

      {phase === "complete" && installationResult && (
        <Box flexDirection="column">
          {installationResult.success ? (
            <Text color="green">
              ✅ Statusline and settings installed successfully!
            </Text>
          ) : (
            <Text color="red">❌ Error: {installationResult.error}</Text>
          )}
        </Box>
      )}

      {phase === "cancelled" && (
        <Text color="yellow">⚠️ Installation cancelled</Text>
      )}
    </Box>
  );
};

render(<App />);
