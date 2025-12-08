# Prepare Work - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow prepares the work environment: checks/creates worktree, creates branch from previous work branch, updates ticket to in-progress.</critical>
<critical>Uses Vibe Kanban MCP tools for ticket management and git commands for worktree/branch management.</critical>

<workflow>

  <step n="1" goal="Load config and get task ticket">
    <action>Resolve variables from config_source: output_folder, user_name, communication_language</action>
    <action>Validate required inputs:
      - {{task_ticket_id}} must be provided
    </action>
    <action>If {{task_ticket_id}} not provided: HALT with error "Task ticket ID is required"</action>
    
    <action>Get task ticket from Vibe Kanban using mcp_vibe_kanban_get_task with {{task_ticket_id}}</action>
    <action>Extract from ticket:
      - Title (contains ticket prefix like "BE-123", "MB-456")
      - Description
      - Status (should be "todo")
      - Project ID (if {{project_id}} not provided)
    </action>
    
    <action>If {{project_id}} not provided:
      - Extract from ticket or ask user
    </action>
    
    <action>Detect agent type from context:
      - If calling agent is Spring Backend Dev: agent_name = "spring-backend-dev", agent_type = "backend"
      - If calling agent is Flutter Dev: agent_name = "flutter-dev", agent_type = "mobile"
      - If {{agent_name}} or {{agent_type}} provided: use provided values
      - Otherwise: ask user
    </action>
    
    <action>Extract ticket prefix from ticket title:
      - Parse title format: "{{prefix}}-{{number}}: {{description}}"
      - Examples: "BE-123: User Service", "MB-456: Login Screen"
      - Store prefix (BE, MB, FE) and number
    </action>
    
    <action>If {{story_key}} not provided:
      - Try to extract from ticket description (look for "Parent Story:" or story reference)
      - Or ask user for story_key
    </action>
  </step>

  <step n="2" goal="Check existing worktree">
    <action>Invoke manage-git-worktree workflow with action="get":
      - agent_name: {{agent_name}}
      - agent_type: {{agent_type}}
      - story_key: {{story_key}}
    </action>
    
    <action>If worktree found:
      - Extract worktree_path and current_branch
      - Store worktree_path
      - Store current_branch as potential base_branch
    </action>
    
    <action>If worktree NOT found:
      - Will create worktree in step 3
    </action>
  </step>

  <step n="3" goal="Determine base branch (previous work branch)">
    <action>If worktree exists and has current_branch:
      - Use current_branch as base_branch (previous work continues)
    </action>
    
    <action>If worktree exists but no current_branch or worktree is new:
      - Check git branch history:
        * List recent branches: git branch --sort=-committerdate
        * Find branches matching pattern: {{agent_type}}/*
        * Get most recent branch for this agent_type
      - Use most recent branch as base_branch
    </action>
    
    <action>If no previous branch found:
      - Use "master" as default base_branch
    </action>
    
    <action>Verify base_branch exists: git branch --list {{base_branch}}</action>
    <action>If base_branch does NOT exist: Use "master" as fallback</action>
  </step>

  <step n="4" goal="Generate branch name from ticket prefix">
    <action>Generate branch name from ticket prefix:
      - Format: {{agent_type}}/{{ticket_prefix}}-{{ticket_number}}
      - Examples:
        * BE-123 ? backend/be-123
        * MB-456 ? mobile/mb-456
      - Sanitize branch name (lowercase, replace invalid chars with hyphens)
    </action>
    
    <action>Check if branch already exists: git branch --list {{branch_name}}</action>
    <action>If branch exists:
      - Ask user: "Branch {{branch_name}} already exists. Use existing branch? (y/n)"
      - If yes: Use existing branch
      - If no: Generate alternative name (add suffix like -2)
    </action>
    
    <action>Store branch_name for later use</action>
  </step>

  <step n="5" goal="Ensure worktree exists and switch to branch">
    <action>If worktree does NOT exist:
      - Invoke manage-git-worktree workflow with action="create":
        * agent_name: {{agent_name}}
        * agent_type: {{agent_type}}
        * story_key: {{story_key}}
        * branch_name: {{branch_name}}
        * base_branch: {{base_branch}}
      - Extract worktree_path from result
    </action>
    
    <action>If worktree exists:
      - Switch to branch in worktree:
        * cd {{worktree_path}}
        * git checkout {{branch_name}} (if branch exists)
        * OR git checkout -b {{branch_name}} {{base_branch}} (if branch doesn't exist)
      - Verify branch switch succeeded
    </action>
    
    <action>Store final worktree_path and branch_name</action>
  </step>

  <step n="6" goal="Update ticket status to in-progress">
    <action>Update task ticket status to "inprogress" using mcp_vibe_kanban_update_task:
      - task_id: {{task_ticket_id}}
      - status: "inprogress"
    </action>
    
    <action>Verify ticket status was updated successfully</action>
  </step>

  <step n="7" goal="Report work environment ready">
    <output>**? Work Environment Ready, {user_name}!**

**Task Ticket:** {{task_ticket_id}} - {{ticket_title}}

**Work Environment:**
- Worktree Path: {{worktree_path}}
- Branch: {{branch_name}}
- Base Branch: {{base_branch}} (previous work)
- Agent: {{agent_name}} ({{agent_type}})
- Story: {{story_key}}

**Ticket Status:** Updated to "inprogress"

**Next Steps:**
1. Work in directory: {{worktree_path}}
2. All file operations should be in this worktree
3. Commit changes to branch: {{branch_name}}
4. When done, use *finish-work to create pull request
5. Ticket will be updated to "inreview" when PR is created
    </output>
  </step>

</workflow>
