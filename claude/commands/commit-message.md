---
allowed-tools: Bash(git add:*), Bash(git commit:*)
description: Perform a comprehensive analysis of staged files in the current Git repository and generate a structured commit message according to the Conventional Commits specification. If significant changes are detected, stage them and create a commit.
---

# Generate Commit Message from Staged Files And Commit It

## Command Objective

Analyze all file changes in the current Git staging area and generate a well-structured commit message following the Conventional Commits specification.
If there has been a significant change, the AI will also stage the changes and create the commit.

## Execution Steps

### 1. Retrieve Staged Files

- Run `git diff --cached --name-status` to view staged files and their status
- Run `git diff --cached` to examine specific code changes

### 2. Analyze Changes

- Identify change type (new feature, bug fix, refactoring, documentation, etc.)
- Determine scope (which modules or components are affected)
- Assess the significance and breaking nature of changes

### 3. Generate Commit Message

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

The commit message should be structured as follows:

```markdown
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Type Selection:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code restructuring (neither feature nor fix)
- `perf`: Performance improvements
- `test`: Testing related changes
- `build`: Build system or external dependencies
- `ci`: CI/CD configuration changes
- `chore`: Other miscellaneous changes

**Rules:**

- Subject line: max 50 characters, imperative mood
- Body: max 72 characters per line, explain what and why
- Footer: include `BREAKING CHANGE:` if applicable
- IMPORTANT: Do not include sensitive information (e.g. API keys, passwords)
- IMPORTANT: Do not include `🤖 Generated with [Claude Code](https://claude.ai/code)`
- IMPORTANT: Do not include `Co-Authored-By: Claude <noreply@anthropic.com>`

### 4. Commit Changes

- If changes are significant, stage them using `git add .`
- Commit the changes with the generated commit message using `git commit -m "<commit message>"`

## Additional Considerations

- Automatically ignore files in .gitignore
- Alert user if staging area is empty
- For extensive changes, suggest splitting into smaller commits
- Consider breaking changes impact on versioning
- If changes span multiple scopes, choose the primary one or omit scope
- Include issue/ticket references in footer when applicable
