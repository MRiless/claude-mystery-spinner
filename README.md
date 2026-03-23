# Mystery Spinner

Each time you start a Claude Code session, the thinking spinner gets taken over by a mystery character. Watch the verbs. Guess who it is. Then reveal the answer.

25 built-in characters spanning film, TV, literature, video games, animals, and unhinged archetypes — from Sherlock Holmes deducing your code to a Golden Retriever fetching your results.

## Install

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

That's it. It reveals the character and gets out of your way.

You can also reveal from the terminal if you prefer:

```bash
node /path/to/claude-mystery-spinner/reveal.js
```

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

## Uninstall

```bash
node /path/to/claude-mystery-spinner/uninstall.js
```

Removes the hook and restores default spinner verbs.

## How It Works

1. `install.js` adds a `SessionStart` hook and a `/whoisit` skill to `~/.claude/`
2. Each session, `pick-theme.js` picks a random character and writes its verbs to `spinnerVerbs` in settings
3. The answer is saved to `~/.claude/.mystery-spinner-answer.json`
4. `/whoisit` (or `reveal.js`) reads that file and shows you who it was

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

## Contributing

PRs with new character themes are welcome. The best ones are funny across multiple sessions — not just the first time you see them.

## License

MIT
