# Create PR From Ticket - Checklist

## Validation Checklist

- [ ] Current branch detected or provided
- [ ] Agent type detected correctly (backend or mobile)
- [ ] Ticket found from branch name (or ticket ID provided)
- [ ] Base branch determined correctly (work started branch)
- [ ] Head branch determined correctly (current task branch)
- [ ] PR template loaded (or default used)
- [ ] Korean characters preserved correctly in PR content
- [ ] Repository owner and name identified from git remote
- [ ] Branches verified to exist (local or remote)
- [ ] Head branch pushed to remote
- [ ] PR created successfully using GitHub MCP
- [ ] Task ticket updated to "inreview" status

## Quality Checks

- [ ] PR title follows format: "[{branch_name}] {ticket_title}"
- [ ] PR body filled with relevant information from template
- [ ] Changed files listed (from git diff)
- [ ] Key changes summarized (from commit messages)
- [ ] Review points identified
- [ ] Checklist items marked appropriately
- [ ] Base branch is correct (work started branch)
- [ ] Head branch is correct (current task branch)
- [ ] Ticket status updated to "inreview"

## Branch Name Format Validation

- [ ] Branch name format: {agent_type}/{ticket_prefix}-{ticket_number}
- [ ] Examples: "backend/be-123", "mobile/mb-456"
- [ ] Ticket prefix and number extracted correctly
- [ ] Ticket found in Vibe Kanban matching branch name

## PR Template Validation

- [ ] PR template loaded from .github/pull_request_template.md
- [ ] Template sections filled:
  - [ ] ?? (Overview)
  - [ ] ???? ? ?? ?? (Changes and Impact)
  - [ ] ??? ?? ?? ??? (Review Focus Points)
  - [ ] ?? ?? (Additional Resources)
  - [ ] ????? (Checklist)
- [ ] Korean characters preserved correctly

## GitHub Integration

- [ ] Repository owner and name extracted from git remote
- [ ] Base branch exists (local or remote)
- [ ] Head branch exists and pushed to remote
- [ ] PR created successfully via GitHub MCP
- [ ] PR number and URL stored

## Ticket Management

- [ ] Ticket found from branch name or provided ID
- [ ] Ticket status updated to "inreview"
- [ ] PR link added to ticket (optional)
