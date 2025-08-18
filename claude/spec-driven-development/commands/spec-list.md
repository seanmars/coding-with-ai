---
allowed-tools: Bash(find:*), Bash(ls:*), Bash(tree:*), Bash(grep:*)
---

# List Specs Command

Display all available spec projects in the `./.claude/specs` directory.

## Usage
```
/spec-list
```

## Purpose

This command provides a quick overview of all spec-driven development projects that have been created or are in progress. Each spec is stored as a folder under `.claude/specs/`, and this command lists all available spec folder names.

## Instructions

You are helping list all available spec projects to give the user an overview of their spec-driven development work.

### Process

1. **Check Specs Directory**
   - Look for the `./.claude/specs` directory in the current project
   - If the directory doesn't exist, inform the user that no specs have been created yet

2. **List Spec Folders**
   - Read all folder names within `./.claude/specs/`
   - Filter to show only directories (ignore any files)
   - Sort the list alphabetically for consistent presentation

3. **Display Results**
   - Show a numbered list of all spec folder names
   - Include the total count of specs found
   - Provide helpful context about what each spec represents

### Output Format

Display the results in this format:

```
📋 Available Specs:

1. user-authentication
2. payment-processing
3. notification-system
4. user-dashboard

Total: 4 specs found

Each spec folder contains:
- requirements.md (Phase 1: Requirements analysis)
- design.md (Phase 2: Technical design)  
- tasks.md (Phase 3: Implementation tasks)

Use /spec-requirements <name>, /spec-design <name>, or /spec-tasks <name> to work on a specific spec.
```

### Edge Cases

1. **No Specs Directory**
   ```
   📋 No specs found.
   
   The .claude/specs directory doesn't exist yet.
   
   To create your first spec, use:
   /spec-requirements <feature-name>
   ```

2. **Empty Specs Directory**
   ```
   📋 No specs found.
   
   The .claude/specs directory exists but is empty.
   
   To create your first spec, use:
   /spec-requirements <feature-name>
   ```

3. **Permission Issues**
   - If unable to read the directory, show a clear error message
   - Suggest checking file permissions or directory access

### Additional Information

- **Phase Indicators**: Optionally show which phase each spec is in by checking for the existence of requirements.md, design.md, and tasks.md files
- **Status Summary**: Could include a brief status indicator (e.g., "Requirements ✓", "Design ✓", "Tasks ⏳")

### Implementation Notes

This is a simple directory listing command that:
- Uses standard file system operations to read directory contents
- Focuses on user experience with clear, helpful output
- Provides context for next steps in the spec-driven workflow
- Handles common error scenarios gracefully

### Integration with Spec Workflow

This command fits into the spec-driven development workflow as:
- **Overview tool**: Helps users see all their active projects
- **Navigation aid**: Shows available specs before starting work on one
- **Progress tracking**: Can indicate completion status of different phases
- **Project management**: Gives a high-level view of development pipeline

## Success Criteria

A successful execution includes:
- [x] Clear listing of all spec folder names
- [x] Helpful count and context information
- [x] Guidance for next steps
- [x] Graceful handling of empty or missing directories
- [x] Consistent, readable formatting

## Example Usage

```
/spec-list
```

This command will scan the `./.claude/specs` directory and present a clean, organized list of all available spec projects, helping users navigate their spec-driven development work effectively.