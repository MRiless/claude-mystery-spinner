#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SPINNER_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".mystery-spinner"
);
const ANSWER_PATH = path.join(SPINNER_DIR, "answer.json");
const SEEN_PATH = path.join(SPINNER_DIR, "seen.json");

function markSeen(name) {
  let seen = [];
  if (fs.existsSync(SEEN_PATH)) {
    seen = JSON.parse(fs.readFileSync(SEEN_PATH, "utf8"));
  }
  if (!seen.includes(name)) {
    seen.push(name);
    fs.writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2) + "\n");
  }
}

function reveal() {
  if (!fs.existsSync(ANSWER_PATH)) {
    console.log("No mystery spinner active. Start a new Claude Code session first.");
    process.exit(1);
  }

  const answer = JSON.parse(fs.readFileSync(ANSWER_PATH, "utf8"));

  const tagLabel = answer.tag ? ` (${answer.tag})` : "";
  const lines = [
    `  Character:  ${answer.name}${tagLabel}`,
    `  From:       ${answer.from}`,
    `  Hint:       ${answer.hint}`,
    ``,
    `  ${answer.oneLiner || ""}`,
  ];
  const maxLen = Math.max(...lines.map((l) => l.length), 22);
  const row = (s) => `  ║ ${s.padEnd(maxLen)} ║`;
  const border = "═".repeat(maxLen + 2);
  const title = "MYSTERY SPINNER REVEAL";
  const gap = maxLen + 2 - title.length;
  const left = " ".repeat(Math.floor(gap / 2));
  const right = " ".repeat(gap - left.length);

  console.log();
  console.log(`  ╔${border}╗`);
  console.log(`  ║${left}${title}${right}║`);
  console.log(`  ╠${border}╣`);
  lines.forEach((l) => console.log(row(l)));
  console.log(`  ╚${border}╝`);
  console.log();

  // Mark this character as seen and pick the next one
  markSeen(answer.name);
  const { pickTheme } = require("./pick-theme");
  pickTheme();
}

reveal();
