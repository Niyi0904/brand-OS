# Prompt Maintenance Guide
# How to keep both prompts accurate as MarketingOS grows

---

## The Two Files

| File | Used in | Purpose |
|---|---|---|
| `claude-project-system-prompt.md` | Claude Projects → Project instructions | Strategic context, milestone state, architectural decisions |
| `.cursorrules` | Repo root (Cursor/Windsurf reads automatically) | Tactical rules, patterns, file-level conventions |

---

## When to Update

### After completing a milestone
1. In `claude-project-system-prompt.md`:
   - Move the milestone from "IN PROGRESS" to "COMPLETE"
   - Add the new files it created to the folder structure
   - Update "Current Build State" section
   - Promote the next milestone to "IN PROGRESS" with its file list

2. In `.cursorrules`:
   - Update "Current Milestone Focus" section
   - Add any new patterns or conventions that emerged
   - Add new quick lookup entries for new files

### After adding a new library
In `.cursorrules`, add to the imports section and note what it replaces or why it was added.

### After making an architectural decision
In `claude-project-system-prompt.md`, add it to "Established Patterns". Even one sentence is enough.
Example: *"Brand context serialisation always goes through `src/lib/brand-context-serializer.ts`. Never build brand-to-prompt logic inline."*

### After a schema migration
Update the "Full Prisma Schema Reference" section in `claude-project-system-prompt.md` to move the new tables from "not yet migrated" to the active list.

---

## Milestone Update Checklist

When M2 is complete, make these specific changes:

**claude-project-system-prompt.md:**
- [ ] Move M2 to COMPLETE, add its files to folder structure
- [ ] Add `src/lib/brand-context-serializer.ts` to established patterns with a usage note
- [ ] Move M3 to IN PROGRESS, list its planned files
- [ ] Add `brand_employees` and `employee_templates` to active Prisma tables

**.cursorrules:**
- [ ] Update "Current Milestone Focus" to M3
- [ ] Add brand-context.ts to quick lookups
- [ ] Add AI provider rules section (it's already there as a stub — flesh it out)

---

## Quick Check — Is Your Prompt Stale?

Ask yourself before starting a new session:
1. Does the folder structure in the prompt match what's actually in the repo? → Update if not.
2. Does "Current Milestone Focus" match what you're working on today? → Update if not.
3. Has a new pattern emerged in the last session that other AI tools should follow? → Add it.

Stale prompts are worse than no prompts — they cause AI tools to confidently generate code based on outdated context.

---

## For Claude Projects Specifically

Paste the full contents of `claude-project-system-prompt.md` into:
**Project → Project instructions** (not a conversation message)

This means every conversation in the project automatically has full context without you pasting anything.

When you start a new conversation, lead with:
> "We're on M[X]. Here's what I need: [task]"

Claude will know the full project state and produce code that fits what already exists.

---

## For Cursor Specifically

Rename `cursorrules` to `.cursorrules` and place it at the **repo root** (same level as `package.json`).

Cursor reads it automatically on every suggestion. You don't need to reference it manually.

For Windsurf, the equivalent file is `.windsurfrules` — the content is identical.
