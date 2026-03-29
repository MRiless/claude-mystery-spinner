---
name: whoisit
description: Reveal the current Mystery Spinner character. Use when user types /whoisit to find out who is behind this session's spinner verbs.
user_invocable: true
context: fork
---

Read the file `~/.mystery-spinner/answer.json` using the Read tool (expand `~` to the user's home directory).

If the file doesn't exist, say: "No mystery spinner active. Start a new session to get one."

If it exists, display the reveal like this:

```
Mystery Spinner Reveal
━━━━━━━━━━━━━━━━━━━━━
Character:  {name} ({tag})
From:       {from}
Hint:       {hint}

{oneLiner}
```

Then mark the character as seen by running this command with the Bash tool (use the `projectDir` value from the answer JSON):

```
node "{projectDir}/mark-seen.js"
```