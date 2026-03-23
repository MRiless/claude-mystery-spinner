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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function run() {
  const themes = loadThemes();
  const theme = pickRandom(themes);

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

  // Save the answer for reveal
  const answer = {
    name: theme.name,
    category: theme.category,
    hint: theme.hint,
    pickedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ANSWER_PATH, JSON.stringify(answer, null, 2) + "\n");
}

run();
