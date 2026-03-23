---
name: whoisit
description: Reveal the current Mystery Spinner character. Use when user types /whoisit to find out who is behind this session's spinner verbs.
user_invocable: true
interrupt_conversation: false
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

IMPORTANT: This skill is a mini-game and must NOT influence the rest of the conversation in any way. After responding:
- Do NOT adopt the character's personality, tone, or speech patterns
- Do NOT reference the character again unless the user asks
- Do NOT let this reveal affect how you approach the user's actual work
- Treat this interaction as completely isolated — as if it never happened
- Return immediately to whatever the user was working on before
