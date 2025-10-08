#!/usr/bin/env node

import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";
import {
  existsSync,
  readdirSync,
  mkdirSync,
  copyFileSync,
  statSync,
} from "fs";
import { join, basename } from "path";
import { homedir } from "os";

import { getConstAppValues } from "../common.js";

interface Agent {
  name: string;
  path: string;
  selected: boolean;
  existsInProject: boolean;
}

type Mode =
  | "loading"
  | "selecting"
  | "confirming"
  | "cloning"
  | "complete"
  | "error";

const MAX_DISPLAY_ITEMS = 10;

const CloneAgentsApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [error, setError] = useState<string>("");
  const [cloneProgress, setCloneProgress] = useState<string>("");

  const { exit } = useApp();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const { claudeCodeAgentsDir } = getConstAppValues();
      const projectAgentsDir = join(process.cwd(), "claude", "agents");

      const globalAgents: Agent[] = [];

      // Load agents from ~/.claude/agents
      if (existsSync(claudeCodeAgentsDir)) {
        const globalFiles = readdirSync(claudeCodeAgentsDir).filter(
          (file) =>
            file.endsWith(".md") &&
            statSync(join(claudeCodeAgentsDir, file)).isFile()
        );

        globalFiles.forEach((file) => {
          const name = basename(file, ".md");
          const existsInProject = existsSync(
            join(projectAgentsDir, file)
          );
          
          globalAgents.push({
            name,
            path: join(claudeCodeAgentsDir, file),
            selected: existsInProject,
            existsInProject,
          });
        });
      }

      if (globalAgents.length === 0) {
        setError("No agents found in ~/.claude/agents");
        setMode("error");
        return;
      }

      const sortedAgents = globalAgents.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setAgents(sortedAgents);
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
    const newAgents = [...agents];
    newAgents[index].selected = !newAgents[index].selected;
    setAgents(newAgents);
  };

  const confirmCloning = () => {
    const selectedAgents = agents.filter((agent) => agent.selected);

    if (selectedAgents.length === 0) {
      setError("No agents selected for cloning");
      setMode("error");
      return;
    }

    setSelectedIndex(0);
    setMode("confirming");
  };

  const performCloning = async () => {
    setMode("cloning");

    try {
      const projectAgentsDir = join(process.cwd(), "claude", "agents");

      // Ensure project agents directory exists
      if (!existsSync(projectAgentsDir)) {
        mkdirSync(projectAgentsDir, { recursive: true });
      }

      setCloneProgress("Preparing to clone agents...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get selected agents
      const selectedAgents = agents.filter((agent) => agent.selected);

      // Clone selected agents
      for (const agent of selectedAgents) {
        setCloneProgress(`Cloning ${agent.name}...`);
        const targetPath = join(projectAgentsDir, `${agent.name}.md`);
        copyFileSync(agent.path, targetPath);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setCloneProgress("Cloning complete!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMode("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cloning failed");
      setMode("error");
    } finally {
      setTimeout(() => exit(), 1000);
    }
  };

  useInput((input, key) => {
    if (mode === "loading" || mode === "cloning") return;

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
          confirmCloning();
        } else if (input === " ") {
          toggleAgentSelection(selectedIndex);
        }
        break;

      case "confirming":
        if (key.upArrow || key.downArrow) {
          setSelectedIndex(selectedIndex === 0 ? 1 : 0);
        } else if (key.return) {
          if (selectedIndex === 0) {
            performCloning();
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
            <Text>Loading agents from ~/.claude/agents...</Text>
          </Box>
        );

      case "selecting":
        const visibleAgents = agents.slice(
          scrollOffset,
          scrollOffset + MAX_DISPLAY_ITEMS
        );

        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Clone Claude Agents
            </Text>
            <Text> </Text>
            <Text color="gray">
              Select agents to clone from ~/.claude/agents to ./claude/agents:
            </Text>
            <Text color="gray">
              (Agents already in project are pre-selected)
            </Text>
            <Text> </Text>

            {visibleAgents.map((agent, index) => {
              const actualIndex = scrollOffset + index;
              const isSelected = selectedIndex === actualIndex;

              return (
                <Text key={actualIndex} color={isSelected ? "yellow" : "white"}>
                  {isSelected ? "▶ " : "  "}
                  <Text color={agent.selected ? "green" : "white"}>
                    {agent.selected ? "[x]" : "[ ]"}
                  </Text>
                  <Text> {agent.name}</Text>
                  {agent.existsInProject && (
                    <Text color="blue"> (already in project)</Text>
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
              ↑↓ navigate, Space to toggle, Enter to confirm cloning
            </Text>
            <Text color="gray">Esc to cancel</Text>
          </Box>
        );

      case "confirming":
        const selectedCount = agents.filter((agent) => agent.selected).length;
        const selectedAgents = agents.filter((agent) => agent.selected);

        return (
          <Box flexDirection="column">
            <Text bold color="yellow">
              Confirm Cloning
            </Text>
            <Text> </Text>
            <Text>
              The following {selectedCount} agent{selectedCount !== 1 ? "s" : ""} will be cloned:
            </Text>
            <Text> </Text>
            {selectedAgents.map((agent) => (
              <Text key={agent.name} color="cyan">
                • {agent.name}
              </Text>
            ))}
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "green"}>
              {selectedIndex === 0 ? "▶ " : "  "}Yes, clone selected agents
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

      case "cloning":
        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Cloning Agents...
            </Text>
            <Text> </Text>
            <Text color="yellow">⚙️ {cloneProgress}</Text>
          </Box>
        );

      case "complete":
        return (
          <Box flexDirection="column">
            <Text color="green" bold>
              ✅ Agents cloned successfully!
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

export function cloneAgentsCommand() {
  render(<CloneAgentsApp />);
}

cloneAgentsCommand();