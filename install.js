#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "settings.json"
);

const PICK_SCRIPT = path.join(__dirname, "pick-theme.js").replace(/\\/g, "/");
const SKILL_SRC = path.join(__dirname, "skills", "whoisit");
const SKILL_DEST = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "skills",
  "whoisit"
);

const HOOK_COMMAND = `node "${PICK_SCRIPT}"`;

function installSkill() {
  const destDir = path.dirname(SKILL_DEST);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Remove existing (stale symlink or old copy)
  try {
    const stat = fs.lstatSync(SKILL_DEST);
    if (stat) fs.rmSync(SKILL_DEST, { recursive: true });
  } catch {
    // Doesn't exist, that's fine
  }

  try {
    fs.symlinkSync(SKILL_SRC, SKILL_DEST, "junction");
    console.log("  /whoisit skill symlinked.");
  } catch {
    // Fallback: copy the file if symlink fails
    fs.mkdirSync(SKILL_DEST, { recursive: true });
    fs.copyFileSync(
      path.join(SKILL_SRC, "SKILL.md"),
      path.join(SKILL_DEST, "SKILL.md")
    );
    console.log("  /whoisit skill copied.");
  }
}

function install() {
  let settings = {};
  if (fs.existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  }

  if (!settings.hooks) {
    settings.hooks = {};
  }
  if (!settings.hooks.SessionStart) {
    settings.hooks.SessionStart = [];
  }

  // Check if hook already installed
  const hookInstalled = settings.hooks.SessionStart.some((entry) =>
    entry.hooks?.some((h) => h.command?.includes("pick-theme.js"))
  );

  if (hookInstalled) {
    console.log("Mystery Spinner hook already installed.");
  } else {
    settings.hooks.SessionStart.push({
      matcher: "",
      hooks: [
        {
          type: "command",
          command: HOOK_COMMAND,
          timeout: 5,
        },
      ],
    });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
    console.log("  SessionStart hook installed.");
  }

  installSkill();

  console.log();
  console.log("Mystery Spinner is ready.");
  console.log("  A new character is picked each time you start Claude Code.");
  console.log("  Type /whoisit inside Claude Code to reveal who it is.");
}

install();
