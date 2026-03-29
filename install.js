#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "settings.json"
);

const SKILL_SRC = path.join(__dirname, "skills", "whoisit");
const SKILL_DEST = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "skills",
  "whoisit"
);

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

function removeOldHook() {
  if (!fs.existsSync(SETTINGS_PATH)) return;

  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));

  if (settings.hooks?.SessionStart) {
    const before = settings.hooks.SessionStart.length;
    settings.hooks.SessionStart = settings.hooks.SessionStart.filter(
      (entry) => !entry.hooks?.some((h) => h.command?.includes("pick-theme.js"))
    );
    if (settings.hooks.SessionStart.length === 0) {
      delete settings.hooks.SessionStart;
    }
    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
    if (settings.hooks?.SessionStart?.length !== before) {
      fs.writeFileSync(
        SETTINGS_PATH,
        JSON.stringify(settings, null, 2) + "\n"
      );
      console.log("  Removed old SessionStart hook.");
    }
  }
}

function install() {
  // Remove the old SessionStart hook if present (no longer needed)
  removeOldHook();

  // Pick the first character
  const { pickTheme } = require("./pick-theme");
  pickTheme();
  console.log("  First character picked.");

  // Install the skill
  installSkill();

  console.log();
  console.log("Mystery Spinner is ready.");
  console.log("  Guess the character from the spinner verbs, then type /whoisit to reveal.");
  console.log("  A new character is picked each time you reveal one.");
}

install();
