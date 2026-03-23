#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ANSWER_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  ".mystery-spinner-answer.json"
);

function reveal() {
  if (!fs.existsSync(ANSWER_PATH)) {
    console.log("No mystery spinner active. Start a new Claude Code session first.");
    process.exit(1);
  }

  const answer = JSON.parse(fs.readFileSync(ANSWER_PATH, "utf8"));

  const lines = [
    `  Character:  ${answer.name}`,
    `  Category:   ${answer.category}`,
    `  Hint:       ${answer.hint}`,
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
}

reveal();
