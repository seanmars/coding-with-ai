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

enum AgentStatus {
  Existing = "existing",
  Available = "available",
  Both = "both",
  Command = "command",
}

interface Agent {
  name: string;
  path: string;
  status: AgentStatus;
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

const SetupAgentsApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [error, setError] = useState<string>("");
  const [installProgress, setInstallProgress] = useState<string>("");

  const { exit } = useApp();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const { claudeCodeDir, claudeCodeAgentsDir } = getConstAppValues();
      const availableAgentsDir = join(process.cwd(), "claude", "agents");

      const availableAgents: Agent[] = [];
      // Process available agents
      if (existsSync(availableAgentsDir)) {
        // Load available agents
        const availableFiles = readdirSync(availableAgentsDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(availableAgentsDir, file)).isFile()
        );

        // Add available agents
        availableFiles.forEach((file) => {
          const name = basename(file, ".md");
          availableAgents.push({
            name,
            path: join(availableAgentsDir, file),
            status: AgentStatus.Available,
            selected: false,
          });
        });
      }

      // Process existing agents
      if (existsSync(claudeCodeAgentsDir)) {
        // Load existing agents
        const existingFiles = readdirSync(claudeCodeAgentsDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(claudeCodeAgentsDir, file)).isFile()
        );

        existingFiles.forEach((file) => {
          // Check if the agent is also available
          const name = basename(file, ".md");
          const availableIndex = availableAgents.findIndex(
            (agent) => agent.name === name
          );
          if (availableIndex === -1) {
            return;
          }

          availableAgents[availableIndex].selected = true;
          availableAgents[availableIndex].status = AgentStatus.Both;
        });
      }

      const allAgents = [...availableAgents].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Add Save option at the end
      allAgents.push({
        name: "Save",
        path: "",
        status: AgentStatus.Command,
        selected: false,
      });

      setAgents(allAgents);
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

  const toggleAgentSelection = (index: number) => {
    if (agents[index].name === "Save") return;

    const newAgents = [...agents];
    newAgents[index].selected = !newAgents[index].selected;
    setAgents(newAgents);
  };

  const confirmInstallation = () => {
    const selectedAgents = agents.filter(
      (agent) => agent.selected && agent.name !== "Save"
    );

    if (selectedAgents.length === 0) {
      setError("No agents selected for installation");
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
      const targetDir = join(homeDirectory, ".claude", "agents");

      // Ensure target directory exists
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      setInstallProgress("Preparing installation...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get selected and unselected agents
      const selectedAgents = agents.filter(
        (agent) => agent.selected && agent.status !== AgentStatus.Command
      );
      const unselectedExistingAgents = agents.filter(
        (agent) => !agent.selected && agent.status !== AgentStatus.Command
      );

      // Copy selected agents
      for (const agent of selectedAgents) {
        setInstallProgress(`Installing ${agent.name}...`);
        const targetPath = join(targetDir, `${agent.name}.md`);
        copyFileSync(agent.path, targetPath);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Remove unselected existing agents
      for (const agent of unselectedExistingAgents) {
        setInstallProgress(`Removing ${agent.name}...`);
        const targetPath = join(targetDir, `${agent.name}.md`);
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
        const totalItems = agents.length;
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
            toggleAgentSelection(selectedIndex);
          }
        } else if (input === " ") {
          if (selectedIndex !== saveIndex) {
            toggleAgentSelection(selectedIndex);
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
            <Text>Loading agents...</Text>
          </Box>
        );

      case "selecting":
        const visibleAgents = agents.slice(
          scrollOffset,
          scrollOffset + MAX_DISPLAY_ITEMS
        );
        const saveIndex = agents.length - 1;

        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Setup Claude Agents
            </Text>
            <Text> </Text>
            <Text color="gray">
              Select agents to install (existing agents are pre-selected):
            </Text>
            <Text> </Text>

            {visibleAgents.map((agent, index) => {
              const actualIndex = scrollOffset + index;
              const isSelected = selectedIndex === actualIndex;
              const isSaveItem = agent.name === "Save";

              return (
                <Text key={actualIndex} color={isSelected ? "yellow" : "white"}>
                  {isSelected ? "▶ " : "  "}
                  {isSaveItem ? (
                    <Text color="green" bold>
                      {agent.name}
                    </Text>
                  ) : (
                    <>
                      <Text color={agent.selected ? "green" : "white"}>
                        {agent.selected ? "[x]" : "[ ]"}
                      </Text>
                      <Text> {agent.name}</Text>
                    </>
                  )}
                </Text>
              );
            })}

            {agents.length > MAX_DISPLAY_ITEMS && (
              <Text color="gray">
                Showing {scrollOffset + 1}-
                {Math.min(scrollOffset + MAX_DISPLAY_ITEMS, agents.length)} of{" "}
                {agents.length}
              </Text>
            )}

            <Text> </Text>
            <Text color="gray">
              ↑↓ navigate, Enter to select Save or Space/Enter to toggle agent
            </Text>
            <Text color="gray">Esc to cancel</Text>
          </Box>
        );

      case "confirming":
        const selectedCount = agents.filter(
          (agent) => agent.selected && agent.name !== "Save"
        ).length;

        return (
          <Box flexDirection="column">
            <Text bold color="yellow">
              Confirm Installation
            </Text>
            <Text> </Text>
            <Text>
              {selectedCount} agent{selectedCount !== 1 ? "s" : ""} will be
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
              Installing Agents...
            </Text>
            <Text> </Text>
            <Text color="yellow">⚙️ {installProgress}</Text>
          </Box>
        );

      case "complete":
        return (
          <Box flexDirection="column">
            <Text color="green" bold>
              ✅ Agents setup completed successfully!
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

export function setupAgentsCommand() {
  render(<SetupAgentsApp />);
}

setupAgentsCommand();
