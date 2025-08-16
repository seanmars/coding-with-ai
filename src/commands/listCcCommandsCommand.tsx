#!/usr/bin/env node

import React, { useState, useEffect } from "react";
import { render, Text, Box, useInput, useApp } from "ink";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface CcCommand {
  name: string;
  script: string;
}

type Mode = "loading" | "displaying" | "error";

const ListCcCommandsApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("loading");
  const [ccCommands, setCcCommands] = useState<CcCommand[]>([]);
  const [error, setError] = useState<string>("");
  const { exit } = useApp();

  useEffect(() => {
    loadCcCommands();
  }, []);

  const loadCcCommands = () => {
    try {
      // 找到 package.json 檔案
      const packageJsonPath = findPackageJson();
      if (!packageJsonPath) {
        setError("無法找到 package.json 檔案");
        setMode("error");
        return;
      }

      // 讀取 package.json
      const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonContent);

      // 抓取 scripts 欄位
      const scripts = packageJson.scripts || {};

      // 過濾出以 cc 開頭的命令
      const ccCommandsList: CcCommand[] = Object.entries(scripts)
        .filter(([name]) => name.startsWith("cc:"))
        .map(([name, script]) => ({
          name,
          script: script as string,
        }));

      setCcCommands(ccCommandsList);
      setMode("displaying");
    } catch (err) {
      setError(
        `讀取 package.json 時發生錯誤: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setMode("error");
    } finally {
      setTimeout(() => {
        exit();
      }, 500);
    }
  };

  const findPackageJson = (): string | null => {
    // 從當前目錄開始往上找 package.json
    let currentDir = process.cwd();

    while (currentDir !== "/" && currentDir !== "\\") {
      const packageJsonPath = join(currentDir, "package.json");
      if (existsSync(packageJsonPath)) {
        return packageJsonPath;
      }

      // 往上一層目錄
      const parentDir = join(currentDir, "..");
      if (parentDir === currentDir) break; // 到達根目錄
      currentDir = parentDir;
    }

    return null;
  };

  useInput((input) => {
    if (input === "q" || input === "\x1b") {
      exit();
    }
  });

  if (mode === "loading") {
    return (
      <Box flexDirection="column">
        <Text color="yellow">🔍 正在讀取 package.json...</Text>
      </Box>
    );
  }

  if (mode === "error") {
    return (
      <Box flexDirection="column">
        <Text color="red">❌ 錯誤: {error}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text color="green" bold>
        📋 可用的命令列表
      </Text>
      <Text color="gray">─────────────────────────────────────</Text>

      {ccCommands.length === 0 ? (
        <Text color="yellow">🔍 沒有找到任何命令</Text>
      ) : (
        ccCommands.map((command, index) => (
          <Box key={index} flexDirection="column">
            <Text color="cyan" bold>
              🗒️ {command.name}
            </Text>
          </Box>
        ))
      )}
    </Box>
  );
};

// 執行應用程式
render(<ListCcCommandsApp />);
