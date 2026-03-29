#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "settings.json"
);
const SPINNER_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".mystery-spinner"
);
const ANSWER_PATH = path.join(SPINNER_DIR, "answer.json");
const SEEN_PATH = path.join(SPINNER_DIR, "seen.json");
const SKILL_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "skills",
  "whoisit"
);

function uninstall() {
  if (!fs.existsSync(SETTINGS_PATH)) {
    console.log("No settings file found. Nothing to uninstall.");
    process.exit(0);
  }

  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));

  // Remove the SessionStart hook
  if (settings.hooks?.SessionStart) {
    settings.hooks.SessionStart = settings.hooks.SessionStart.filter(
      (entry) => !entry.hooks?.some((h) => h.command?.includes("pick-theme.js"))
    );
    if (settings.hooks.SessionStart.length === 0) {
      delete settings.hooks.SessionStart;
    }
    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
  }

  // Remove spinnerVerbs
  delete settings.spinnerVerbs;

  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  // Clean up spinner data directory
  if (fs.existsSync(SPINNER_DIR)) {
    fs.rmSync(SPINNER_DIR, { recursive: true });
  }

  // Remove skill
  try {
    fs.rmSync(SKILL_PATH, { recursive: true });
  } catch {
    // Already gone
  }

  console.log("Mystery Spinner uninstalled. Spinner verbs restored to defaults.");
}

uninstall();
