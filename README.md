# Mystery Spinner for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> A fun add-in for Claude Code that turns the thinking spinner into a guessing game.

Each time you start a Claude Code session, the spinner verbs get taken over by a mystery character. Watch the clues. Guess who it is. Then reveal the answer.

25 built-in characters spanning film, TV, literature, video games, animals, and unhinged archetypes — from Sherlock Holmes deducing your code to a Golden Retriever fetching your results.

You'll never see the same character twice until you've revealed them all.

## Quick Install

**One-liner (clone + install):**

```bash
git clone https://github.com/MRiless/claude-mystery-spinner.git ~/.claude-mystery-spinner && node ~/.claude-mystery-spinner/install.js
```

**Or from inside Claude Code — paste this into the prompt:**

```
! git clone https://github.com/MRiless/claude-mystery-spinner.git ~/.claude-mystery-spinner && node ~/.claude-mystery-spinner/install.js
```

**Or step by step:**

```bash
git clone https://github.com/MRiless/claude-mystery-spinner.git
cd claude-mystery-spinner
node install.js
```

That's it. Next time you open Claude Code, you'll have a new character.

## Usage

Just use Claude Code normally. The spinner verbs ("Thinking", "Analyzing", etc.) will be replaced with character-themed ones.

When you think you know who it is — or give up — type inside Claude Code:

```
/whoisit
```

This reveals the character, marks it as seen, and gets out of your way.

You can also reveal from the terminal:

```bash
node ~/.claude-mystery-spinner/reveal.js
```

## How the Tracking Works

- Each time you **reveal** a character (via `/whoisit` or `reveal.js`), it's marked as seen
- Future sessions only pick from characters you **haven't** revealed yet
- Once you've revealed all 25, the cycle resets and they all come back
- If you never reveal a character, it stays in the pool — no penalty for skipping

## Example

You start a session and see:

```
⠋ Finding it absolutely raw...
⠙ Questioning the seasoning...
⠸ Slamming the fridge shut...
```

You know exactly who that is.

## Adding Custom Themes

Create a `themes-custom.json` in the project directory with the same format:

```json
[
  {
    "name": "Your Character",
    "category": "Film",
    "hint": "A subtle clue for the reveal",
    "verbs": [
      "Doing something characteristic",
      "Another in-character verb",
      "A third one",
      "Keep going to 8-12 total"
    ]
  }
]
```

Custom themes are automatically included in the rotation.

### Tips for Writing Good Themes

- **8-12 verbs** per character — enough variety that it doesn't repeat too fast
- **Hint, don't name-drop** — "Breathing heavily" not "Darth Vader breathing"
- **Mix obvious and subtle** — some verbs should be dead giveaways, others should make you think
- **Keep them short** — they show in a spinner, not a novel
- **Present participle form** — "Consulting the map" not "Consults the map"

## Built-in Characters

| Character | Category | Difficulty |
|-----------|----------|-----------|
| Sherlock Holmes | Literature | Easy |
| Gordon Ramsay | Television | Easy |
| Bob Ross | Television | Easy |
| A Cat | Animal | Easy |
| Shakespeare | Literature | Medium |
| David Attenborough | Television | Medium |
| Gandalf | Film / Literature | Easy |
| A Noir Detective | Archetype | Medium |
| Batman | Comics / Film | Easy |
| Jeff Goldblum | Film | Medium |
| A Passive-Aggressive Coworker | Archetype | Easy |
| Mario | Video Games | Easy |
| A Robot Becoming Sentient | Archetype | Medium |
| Julia Child | Television | Hard |
| Darth Vader | Film | Easy |
| A Golden Retriever | Animal | Easy |
| Snoop Dogg | Music | Medium |
| An Ikea Instruction Manual | Object | Medium |
| A Toddler | Archetype | Medium |
| Morgan Freeman | Film | Medium |
| A Haunted Victorian Doll | Horror | Hard |
| Grandma Sending a Text | Archetype | Easy |
| Christopher Walken | Film | Medium |
| An Overly Honest GPS | Object | Medium |
| Yoda | Film | Easy |

## Uninstall

```bash
node ~/.claude-mystery-spinner/uninstall.js
```

Removes the hook, spinner verbs, tracking data, and restores defaults.

## How It Works

1. `install.js` adds a `SessionStart` hook and a `/whoisit` skill to `~/.claude/`
2. Each session, `pick-theme.js` picks a random unseen character and writes its verbs to `spinnerVerbs` in settings
3. The answer is saved to `~/.claude/.mystery-spinner-answer.json`
4. `/whoisit` (or `reveal.js`) shows the character and marks it as seen in `~/.claude/.mystery-spinner-seen.json`
5. Once all characters are revealed, the seen list resets

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (the Anthropic CLI for Claude)
- Node.js 18+

## Contributing

PRs with new character themes are welcome. The best ones are funny across multiple sessions — not just the first time you see them.

## License

MIT
