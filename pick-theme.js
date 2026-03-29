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
const THEMES_PATH = path.join(__dirname, "themes.json");

// Also check for user-added custom themes
const CUSTOM_THEMES_PATH = path.join(__dirname, "themes-custom.json");

// Tags prefixed to spinner verbs so the user can tell when the character changes
const TAGS = [
  "◆", "●", "■", "▲", "★", "♠", "♣", "♥", "♦",
  "☀", "⚓", "♔", "☯", "♪", "▼", "○", "□", "△", "☆", "◇",
];

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

function pickTag() {
  // Pick a tag that differs from the current one
  let currentTag = null;
  if (fs.existsSync(ANSWER_PATH)) {
    try {
      currentTag = JSON.parse(fs.readFileSync(ANSWER_PATH, "utf8")).tag;
    } catch {
      // Corrupted or missing, that's fine
    }
  }
  const available = TAGS.filter((t) => t !== currentTag);
  return pickRandom(available);
}

function pickTheme() {
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
  const tag = pickTag();

  // Read existing settings
  let settings = {};
  if (fs.existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  }

  // Update spinner verbs with tag prefix
  settings.spinnerVerbs = {
    mode: "replace",
    verbs: theme.verbs.map((v) => `${tag} ${v}`),
  };

  // Write settings back
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  // Ensure spinner data directory exists
  if (!fs.existsSync(SPINNER_DIR)) {
    fs.mkdirSync(SPINNER_DIR, { recursive: true });
  }

  // Save the answer for reveal (include projectDir so the skill can find mark-seen.js)
  const answer = {
    name: theme.name,
    from: theme.from,
    category: theme.category,
    hint: theme.hint,
    oneLiner: theme.oneLiner,
    tag,
    projectDir: __dirname.replace(/\\/g, "/"),
    pickedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ANSWER_PATH, JSON.stringify(answer, null, 2) + "\n");
}

module.exports = { pickTheme };

// Allow direct execution for install
if (require.main === module) {
  pickTheme();
}
