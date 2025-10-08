#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";

import {
  ClaudeCodeStatuslineElementType,
  StatuslineConfig,
  StatusElementData,
} from "../types.js";
import { getConstAppValues, loadStatuslineConfig } from "../common.js";

type Mode =
  | "loading"
  | "setup"
  | "configuring"
  | "edit-item"
  | "saving"
  | "confirm-overwrite"
  | "complete";

interface ColorInfo {
  name: string;
  hex: string;
}

interface ItemOption {
  label: string;
  value: ClaudeCodeStatuslineElementType;
}

const DefaultColors: ColorInfo[] = [
  { name: "red", hex: "#af4545" },
  { name: "green", hex: "#198519" },
  { name: "yellow", hex: "#d1d132" },
  { name: "blue", hex: "#2929e6" },
  { name: "magenta", hex: "#c737c7" },
  { name: "cyan", hex: "#1ac7c7" },
  { name: "white", hex: "#ffffff" },
  { name: "black", hex: "#000000" },
  { name: "gray", hex: "#808080" },
  { name: "light gray", hex: "#d3d3d3" },
  { name: "dark gray", hex: "#404040" },
];

const ElementTypeOptions: ItemOption[] = [
  { label: "Time", value: "time" },
  { label: "Current Directory", value: "cwd" },
  { label: "Model", value: "model" },
  { label: "Version", value: "version" },
  { label: "Git Branch", value: "git-branch" },
  { label: "Total Tokens", value: "total-tokens" },
  { label: "Input Tokens", value: "input-tokens" },
  { label: "Output Tokens", value: "output-tokens" },
  { label: "Cached Tokens", value: "cached-tokens" },
  { label: "Context Length", value: "context-length" },
  { label: "Cost", value: "cost" },
  { label: "Duration", value: "duration" },
  { label: "Output Style", value: "output-style" }
];

const SetupApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [config, setConfig] = useState<StatuslineConfig>({ elements: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingField, setEditingField] = useState<"type" | "color">("type");

  const { exit } = useApp();

  useEffect(() => {
    const loadConfig = async () => {
      const { userStatuslineConfigPath } = getConstAppValues();
      const loadedConfig = await loadStatuslineConfig(userStatuslineConfigPath);
      setConfig(loadedConfig);
      setMode("setup");
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    const { userStatuslineConfigPath } = getConstAppValues();

    // Check if file exists and ask for confirmation
    if (existsSync(userStatuslineConfigPath)) {
      setSelectedIndex(1);
      setMode("confirm-overwrite");
      return;
    }

    // File doesn't exist, proceed with saving
    performSave();
  };

  const performSave = async () => {
    setMode("saving");
    try {
      const { userStatuslineDir, userStatuslineConfigPath } = getConstAppValues();

      if (!existsSync(userStatuslineDir)) {
        mkdirSync(userStatuslineDir, { recursive: true });
      }

      writeFileSync(userStatuslineConfigPath, JSON.stringify(config, null, 2));
      setMode("complete");

      setTimeout(() => {
        exit();
      }, 500);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      setMode("setup");
    }
  };

  const addNewItem = () => {
    const newItem: StatusElementData = {
      type: "time",
      color: "#ffffff",
    };
    setConfig({
      ...config,
      elements: [...config.elements, newItem],
    });
    setEditingIndex(config.elements.length);
    setEditingField("type");
    setMode("edit-item");
  };

  const removeItem = (index: number) => {
    const newElements = config.elements.filter((_, i) => i !== index);
    setConfig({ ...config, elements: newElements });
    if (selectedIndex >= newElements.length) {
      setSelectedIndex(Math.max(0, newElements.length - 1));
    }
  };

  const updateItem = (index: number, updates: Partial<StatusElementData>) => {
    const newElements = [...config.elements];
    newElements[index] = { ...newElements[index], ...updates };
    setConfig({ ...config, elements: newElements });
  };

  const getElementLabel = (type: ClaudeCodeStatuslineElementType): string => {
    const option = ElementTypeOptions.find((opt) => opt.value === type);
    return option ? option.label : type;
  };

  const getColorName = (hex: string): string => {
    const color = DefaultColors.find((c) => c.hex === hex);
    return color ? color.name : hex;
  };

  useInput((input, key) => {
    if (mode === "loading" || mode === "saving") return;

    if (key.escape && mode !== "setup") {
      if (mode === "configuring") {
        setSelectedIndex(0);
        setMode("setup");
      } else if (mode === "confirm-overwrite") {
        setSelectedIndex(1);
        setMode("setup");
      }
      return;
    }

    if (key.escape && mode === "setup") {
      exit();
    }

    switch (mode) {
      case "setup":
        if (key.upArrow) {
          setSelectedIndex(selectedIndex === 0 ? 1 : 0);
        } else if (key.downArrow) {
          setSelectedIndex(selectedIndex === 1 ? 0 : 1);
        } else if (key.return || input === " ") {
          if (selectedIndex === 0) {
            setMode("configuring");
            setSelectedIndex(0);
          } else {
            saveConfig();
          }
        }
        break;

      case "configuring":
        /**
         * +1 for "Add Item"
         * +1 for "Done"
         */
        const elementCount = config.elements.length;
        const totalItems = elementCount + 2;
        const addItemIndex = elementCount;
        const doneIndex = elementCount + 1;

        if (key.upArrow) {
          setSelectedIndex(
            selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1
          );
        } else if (key.downArrow) {
          setSelectedIndex(
            selectedIndex === totalItems - 1 ? 0 : selectedIndex + 1
          );
        } else if (key.return || input === " ") {
          if (selectedIndex === addItemIndex) {
            // Add new item
            addNewItem();
          } else if (selectedIndex === doneIndex) {
            setSelectedIndex(0);
            setMode("setup");
          } else {
            // Edit existing item
            setEditingIndex(selectedIndex);
            setEditingField("type");
            setMode("edit-item");
          }
        } else if (key.delete && selectedIndex < config.elements.length) {
          removeItem(selectedIndex);
        }
        break;

      case "edit-item":
        if (key.upArrow || key.downArrow) {
          setEditingField(editingField === "type" ? "color" : "type");
        } else if (key.rightArrow) {
          const currentItem = config.elements[editingIndex];
          if (editingField === "type") {
            // Rotate through element types
            const currentTypeIndex = ElementTypeOptions.findIndex(
              (opt) => opt.value === currentItem.type
            );
            const nextTypeIndex =
              (currentTypeIndex + 1) % ElementTypeOptions.length;
            updateItem(editingIndex, {
              type: ElementTypeOptions[nextTypeIndex].value,
            });
          } else {
            // Rotate through colors
            const currentColorIndex = DefaultColors.findIndex(
              (c) => c.hex === currentItem.color
            );
            const nextColorIndex =
              (currentColorIndex + 1) % DefaultColors.length;
            updateItem(editingIndex, {
              color: DefaultColors[nextColorIndex].hex,
            });
          }
        } else if (key.leftArrow) {
          const currentItem = config.elements[editingIndex];
          if (editingField === "type") {
            // Rotate through element types
            const currentTypeIndex = ElementTypeOptions.findIndex(
              (opt) => opt.value === currentItem.type
            );
            const nextTypeIndex =
              (currentTypeIndex - 1 + ElementTypeOptions.length) %
              ElementTypeOptions.length;
            updateItem(editingIndex, {
              type: ElementTypeOptions[nextTypeIndex].value,
            });
          } else {
            // Rotate through colors
            const currentColorIndex = DefaultColors.findIndex(
              (c) => c.hex === currentItem.color
            );
            const nextColorIndex =
              (currentColorIndex - 1 + DefaultColors.length) %
              DefaultColors.length;
            updateItem(editingIndex, {
              color: DefaultColors[nextColorIndex].hex,
            });
          }
        } else if (key.delete) {
          removeItem(editingIndex);
          setMode("configuring");
        } else if (key.return) {
          setSelectedIndex(editingIndex);
          setMode("configuring");
        }
        break;

      case "confirm-overwrite":
        if (key.upArrow) {
          setSelectedIndex(selectedIndex === 0 ? 1 : 0);
        } else if (key.downArrow) {
          setSelectedIndex(selectedIndex === 1 ? 0 : 1);
        } else if (key.return || input === " ") {
          if (selectedIndex === 0) {
            // Overwrite
            performSave();
          } else {
            // Cancel
            setMode("setup");
          }
        }
        break;

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
            <Text>Loading configuration...</Text>
          </Box>
        );

      case "setup":
        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Claude Code Statusline Setup
            </Text>
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "white"}>
              {selectedIndex === 0 ? "▶ " : "  "}Configure
            </Text>
            <Text color={selectedIndex === 1 ? "yellow" : "white"}>
              {selectedIndex === 1 ? "▶ " : "  "}Save
            </Text>
            <Text> </Text>
            <Text color="gray">
              Use ↑↓ to navigate, Enter to select, Esc to exit
            </Text>
          </Box>
        );

      case "configuring":
        const maxIndex = config.elements.length;
        const addItemIndex = maxIndex;
        const doneIndex = maxIndex + 1;

        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Configure Statusline Elements
            </Text>
            <Text> </Text>
            {config.elements.map((element, index) => (
              <Text
                key={index}
                color={selectedIndex === index ? "yellow" : "white"}
              >
                {selectedIndex === index ? "▶ " : "  "}
                {getElementLabel(element.type)}
                <Text color={element.color || "#ffffff"}> ●</Text>
                <Text color="gray">
                  {" "}
                  ({getColorName(element.color || "#ffffff")})
                </Text>
              </Text>
            ))}
            <Text color={selectedIndex === addItemIndex ? "yellow" : "white"}>
              {selectedIndex === addItemIndex ? "▶ " : "  "}Add Item
            </Text>
            <Text color={selectedIndex === doneIndex ? "yellow" : "white"}>
              {selectedIndex === doneIndex ? "▶ " : "  "}Done
            </Text>
            <Text> </Text>
            <Text color="gray">↑↓ navigate, Esc to go back </Text>
            <Text color="gray">Enter or Space to edit</Text>
            <Text color="gray">Delete to remove</Text>
          </Box>
        );

      case "edit-item":
        const currentItem = config.elements[editingIndex];
        return (
          <Box flexDirection="column">
            <Text bold color="cyan">
              Edit Item
            </Text>
            <Text> </Text>
            <Text color={editingField === "type" ? "yellow" : "white"}>
              {editingField === "type" ? "▶ " : "  "}Item Type:{" "}
              {getElementLabel(currentItem.type)}
            </Text>
            <Text color={editingField === "color" ? "yellow" : "white"}>
              {editingField === "color" ? "▶ " : "  "}Item Color:
              <Text color={currentItem.color || "#ffffff"}> ●</Text>
              <Text color="gray">
                {" "}
                ({getColorName(currentItem.color || "#ffffff")})
              </Text>
            </Text>
            <Text>
              <Text color="gray">Preview: </Text>
              <Text color={currentItem.color || "#ffffff"}>
                {getElementLabel(currentItem.type)}
              </Text>
            </Text>
            <Text> </Text>
            <Text color="gray">↑ ↓ navigate, ← → to change {editingField}</Text>
            <Text color="gray">Enter to complete</Text>
            <Text color="gray">Delete to remove</Text>
          </Box>
        );

      case "saving":
        return (
          <Box flexDirection="column">
            <Text>Saving configuration...</Text>
          </Box>
        );

      case "confirm-overwrite":
        return (
          <Box flexDirection="column">
            <Text bold color="yellow">
              ⚠️ Configuration file already exists
            </Text>
            <Text> </Text>
            <Text>Do you want to overwrite the existing file?</Text>
            <Text> </Text>
            <Text color={selectedIndex === 0 ? "yellow" : "red"}>
              {selectedIndex === 0 ? "▶ " : "  "}⭕Yes
            </Text>
            <Text color={selectedIndex === 1 ? "yellow" : "green"}>
              {selectedIndex === 1 ? "▶ " : "  "}❌No
            </Text>
            <Text> </Text>
            <Text color="gray">
              Use ↑↓ to navigate, Enter to select, Esc to cancel
            </Text>
          </Box>
        );

      case "complete":
        return (
          <Box flexDirection="column">
            <Text color="green">✅ Configuration saved successfully!</Text>
          </Box>
        );

      default:
        return <Text>Unknown mode</Text>;
    }
  };

  return renderMode();
};

export function setupCommand() {
  render(<SetupApp />);
}

setupCommand();
