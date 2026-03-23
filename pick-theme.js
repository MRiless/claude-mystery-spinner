#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "settings.json"
);
const ANSWER_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  ".mystery-spinner-answer.json"
);
const SEEN_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  ".mystery-spinner-seen.json"
);
const THEMES_PATH = path.join(__dirname, "themes.json");

// Also check for user-added custom themes
const CUSTOM_THEMES_PATH = path.join(__dirname, "themes-custom.json");

function loadThemes() {
  const themes = JSON.parse(fs.readFileSync(THEMES_PATH, "utf8"));
  if (fs.existsSync(CUSTOM_THEMES_PATH)) {
    const custom = JSON.parse(fs.readFileSync(CUSTOM_THEMES_PATH, "utf8"));
    themes.push(...custom);
  }
  return themes;
}

function loadSeen() {
  if (fs.existsSync(SEEN_PATH)) {
    return JSON.parse(fs.readFileSync(SEEN_PATH, "utf8"));
  }
  return [];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function run() {
  const themes = loadThemes();
  let seen = loadSeen();

  // Filter to unseen characters
  let available = themes.filter((t) => !seen.includes(t.name));

  // If all characters have been revealed, reset and start fresh
  if (available.length === 0) {
    seen = [];
    fs.writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2) + "\n");
    available = themes;
  }

  const theme = pickRandom(available);

  // Read existing settings
  let settings = {};
  if (fs.existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  }

  // Update spinner verbs
  settings.spinnerVerbs = {
    mode: "replace",
    verbs: theme.verbs,
  };

  // Write settings back
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  // Save the answer for reveal (include projectDir so the skill can find mark-seen.js)
  const answer = {
    name: theme.name,
    from: theme.from,
    category: theme.category,
    hint: theme.hint,
    projectDir: __dirname.replace(/\\/g, "/"),
    pickedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ANSWER_PATH, JSON.stringify(answer, null, 2) + "\n");
}

run();
