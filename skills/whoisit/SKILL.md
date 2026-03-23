---
name: whoisit
description: Reveal the current Mystery Spinner character. Use when user types /whoisit to find out who is behind this session's spinner verbs.
user_invocable: true
---

Read the file `~/.claude/.mystery-spinner-answer.json` using the Read tool (expand `~` to the user's home directory).

If the file doesn't exist, say: "No mystery spinner active. Start a new session to get one."

If it exists, display the reveal like this:

```
Mystery Spinner Reveal
━━━━━━━━━━━━━━━━━━━━━
Character:  {name}
From:       {from}
Hint:       {hint}
```

Then add a one-liner reaction to the character, something dry and funny. Keep it to one sentence.

After displaying the reveal, mark the character as seen by running this command with the Bash tool (use the `projectDir` value from the answer JSON):

```
node "{projectDir}/mark-seen.js"
```

Do NOT change the subject, ask follow-up questions, or interrupt whatever the user was working on. Just reveal, mark seen, and move on.
