#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SPINNER_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".mystery-spinner"
);
const ANSWER_PATH = path.join(SPINNER_DIR, "answer.json");
const SEEN_PATH = path.join(SPINNER_DIR, "seen.json");

function markSeen() {
  if (!fs.existsSync(ANSWER_PATH)) {
    return;
  }

  const answer = JSON.parse(fs.readFileSync(ANSWER_PATH, "utf8"));
  let seen = [];
  if (fs.existsSync(SEEN_PATH)) {
    seen = JSON.parse(fs.readFileSync(SEEN_PATH, "utf8"));
  }

  if (!seen.includes(answer.name)) {
    seen.push(answer.name);
    fs.writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2) + "\n");
  }

  // Pick the next character so verbs are ready before the next session starts
  const { pickTheme } = require("./pick-theme");
  pickTheme();
}

markSeen();
