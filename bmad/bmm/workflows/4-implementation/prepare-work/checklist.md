# Prepare Work - Validation Checklist

Use this checklist to validate the prepare-work workflow execution.

## Input Validation

- [ ] task_ticket_id is provided
- [ ] Task ticket exists in Vibe Kanban
- [ ] Ticket status is "todo" (can be updated to "inprogress")
- [ ] Agent type is detected correctly (backend or mobile)

## Worktree Management

- [ ] Worktree is checked or created successfully
- [ ] Worktree path is valid and accessible
- [ ] Worktree is associated with correct agent type

## Branch Management

- [ ] Base branch is determined correctly (previous work branch or master)
- [ ] Branch name is generated from ticket prefix correctly
- [ ] Branch name format: {agent_type}/{ticket_prefix}-{ticket_number}
- [ ] Branch is created or switched to successfully
- [ ] Branch is based on correct base branch

## Ticket Management

- [ ] Ticket status is updated to "inprogress"
- [ ] Ticket update is successful

## Output Validation

- [ ] worktree_path is set and valid
- [ ] branch_name is set and valid
- [ ] base_branch is set and valid
- [ ] All variables are available for next workflows

## Error Handling

- [ ] Missing ticket ID is handled gracefully
- [ ] Invalid ticket ID is handled gracefully
- [ ] Worktree creation failure is handled gracefully
- [ ] Branch creation failure is handled gracefully
- [ ] Ticket update failure is handled gracefully
