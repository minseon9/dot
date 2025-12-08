# Create PR From Ticket - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates a pull request from completed work: finds ticket from branch name, creates PR with template, updates ticket to in-review.</critical>
<critical>Uses GitHub MCP tools for PR creation and Vibe Kanban MCP for ticket management.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly.</critical>

<workflow>

  <step n="1" goal="Detect current branch and agent context">
    <action>Resolve variables from config_source: output_folder, user_name, communication_language, document_output_language</action>
    
    <action>Detect agent type from context:
      - If calling agent is Spring Backend Dev: agent_name = "spring-backend-dev", agent_type = "backend"
      - If calling agent is Flutter Dev: agent_name = "flutter-dev", agent_type = "mobile"
      - If {{agent_name}} or {{agent_type}} provided: use provided values
      - Otherwise: ask user
    </action>
    
    <action>Detect current branch:
      - If {{branch_name}} provided: use it
      - Otherwise: Get current branch from git: git rev-parse --abbrev-ref HEAD
      - Store as {{head_branch}}
    </action>
    
    <action>If {{worktree_path}} not provided:
      - Check if we're in a worktree (git rev-parse --git-dir)
      - If in worktree: Extract worktree path
      - Otherwise: Use current directory or ask user
    </action>
    
    <action>Validate branch name format:
      - Expected format: {{agent_type}}/{{ticket_prefix}}-{{ticket_number}}
      - Examples: "backend/be-123", "mobile/mb-456"
      - If format doesn't match: Ask user to confirm branch name or provide ticket ID directly
    </action>
  </step>

  <step n="2" goal="Find ticket from branch name">
    <action>Extract ticket prefix and number from branch name:
      - Parse branch format: {{agent_type}}/{{ticket_prefix}}-{{ticket_number}}
      - Examples:
        * "backend/be-123" ? prefix="BE", number="123"
        * "mobile/mb-456" ? prefix="MB", number="456"
      - Convert prefix to uppercase (be ? BE, mb ? MB)
    </action>
    
    <action>If {{task_ticket_id}} provided:
      - Use provided ticket ID
      - Skip ticket search
    </action>
    
    <action>If {{task_ticket_id}} NOT provided:
      - If {{project_id}} not provided: Ask user for project_id
      - List all tasks in project using mcp_vibe_kanban_list_tasks with {{project_id}}
      - Search for ticket with matching prefix and number:
        * Look for ticket title containing "{{prefix}}-{{number}}"
        * Example: "BE-123: User Service" matches "backend/be-123"
      - If multiple matches: Ask user to select
      - If no match: Ask user to provide ticket ID directly
      - Store found ticket ID as {{task_ticket_id}}
    </action>
    
    <action>Get task ticket from Vibe Kanban using mcp_vibe_kanban_get_task with {{task_ticket_id}}</action>
    <action>Extract from ticket:
      - Title
      - Description (implementation plan)
      - Status (should be "inprogress" or "done")
      - Project ID (if {{project_id}} not provided)
    </action>
    
    <action>Verify ticket status allows PR creation:
      - Status should be "inprogress" or "done"
      - If status is "todo": Warn user that work should be started first
      - If status is "inreview": Inform user that PR may already exist
    </action>
  </step>

  <step n="3" goal="Determine base branch (work started branch)">
    <action>Get base branch from git (try multiple methods in order):
      
      Method 1: Check git reflog for branch creation:
      - Run: git reflog show {{head_branch}} | head -20
      - Look for "checkout: moving from X to Y" or "branch: Created from X"
      - Extract the source branch (X) as base_branch
      
      Method 2: Check git config for upstream:
      - Run: git config branch.{{head_branch}}.merge
      - If set, extract branch name (remove "refs/heads/" prefix)
      - Use as base_branch
      
      Method 3: Find merge base with common branches:
      - Try common base branches: "master", "main", "develop"
      - For each candidate, check: git merge-base {{head_branch}} {{candidate}}
      - If merge base exists and is not the same as head_branch HEAD, candidate is likely the base
      - Use the first matching candidate as base_branch
      
      Method 4: Check git log for first commit:
      - Run: git log --reverse --first-parent {{head_branch}} --oneline | head -1
      - Get parent commit: git log --reverse --first-parent {{head_branch}}^..{{head_branch}} --oneline | head -1
      - Find which branch contains that parent commit
      - Use that branch as base_branch
    </action>
    
    <action>If base branch detection fails or ambiguous:
      - List recent branches: git branch --sort=-committerdate | head -10
      - Show user the list and ask: "Which branch was used as base when creating {{head_branch}}?"
      - Common answers: "master", "main", "develop", or another feature branch
      - Store user's answer as base_branch
    </action>
    
    <action>Verify base_branch exists:
      - Check local: git branch --list {{base_branch}}
      - Check remote: git branch -r --list origin/{{base_branch}}
      - If base_branch doesn't exist locally or remotely: HALT with error "Base branch {{base_branch}} not found. Please ensure the branch exists."
    </action>
    
    <action>Store base_branch for PR creation</action>
  </step>

  <step n="4" goal="Load PR template">
    <action>Check if PR template exists at {{pr_template_path}}</action>
    <check if="PR template exists">
      <action>Load PR template file with UTF-8 encoding</action>
      <action>Verify Korean characters are preserved correctly</action>
    </check>
    <check if="PR template does NOT exist">
      <action>Create default PR template structure:
        ```
        ## ??
        <!-- **? PR? ??? ??**? ??? ??????. -->
        
        ## ???? ? ?? ??
        <!-- **?? ??? ??????, ?? ???/??? ??? ????** ??????. -->
        
        ## ??? ?? ?? ???
        <!-- ?? ??, ??/?? ?? ? ????? ??????. -->
        
        ## ?? ??
        <!-- ????, ?? ??, API ??/?? ??, ??? ??, ?? ?? ??, ?? ??/?? ?? -->
        
        ## ?????
        ...
        ```
      </action>
      <action>Use default template for PR body</action>
    </check>
  </step>

  <step n="5" goal="Get repository information">
    <action>Get repository owner and name from git remote:
      - Get remote URL: git remote get-url origin
      - Parse URL format:
        * SSH: git@github.com:owner/repo.git ? owner="owner", repo="repo"
        * HTTPS: https://github.com/owner/repo.git ? owner="owner", repo="repo"
        * HTTPS with .git: https://github.com/owner/repo ? owner="owner", repo="repo"
      - Store as {{repo_owner}} and {{repo_name}}
    </action>
    
    <action>If remote parsing fails:
      - Ask user for repository owner and name
      - Store as {{repo_owner}} and {{repo_name}}
    </action>
  </step>

  <step n="6" goal="Analyze changes and prepare PR content">
    <action>Get diff between base and head branches:
      - Use git diff: git diff {{base_branch}}..{{head_branch}} --stat
      - Get changed files list
      - Count lines changed
      - Get commit messages: git log {{base_branch}}..{{head_branch}} --oneline
    </action>
    
    <action>Prepare PR title:
      - If {{pr_title}} provided: use it
      - Otherwise: Format: "[{{branch_name}}] {{ticket_title}}"
      - Examples:
        * "[backend/be-123] User Service Implementation"
        * "[mobile/mb-456] Login Screen"
      - Remove ticket prefix from title if it's redundant (e.g., "BE-123: " prefix)
    </action>
    
    <action>Prepare PR body from template:
      - Fill in "??" section:
        * Task ticket title and description
        * Implementation summary from ticket description
        * Link to ticket (if available)
      - Fill in "???? ? ?? ??" section:
        * List of changed files (from git diff --stat)
        * Key changes made (from commit messages)
        * Affected modules/services
      - Fill in "??? ?? ?? ???" section:
        * Architecture decisions (if mentioned in ticket)
        * Security considerations
        * Performance implications
        * Testing approach
      - Fill in "?? ??" section:
        * Task ticket link (if available)
        * Story file link (if mentioned in ticket)
        * Architecture references
      - Fill in "?????" section:
        * Mark completed items based on implementation
        * Leave unchecked items for reviewer
    </action>
    
    <action>Use UTF-8 encoding for all PR content</action>
  </step>

  <step n="7" goal="Create pull request using GitHub MCP">
    <action>Verify branches exist:
      - Check if {{base_branch}} exists (local or remote)
      - Check if {{head_branch}} exists (local or remote)
      - If branches don't exist: HALT with error
    </action>
    
    <action>Ensure head_branch is pushed to remote:
      - Check if head_branch exists on remote: git ls-remote --heads origin {{head_branch}}
      - If not pushed: Ask user to push first, or push automatically: git push origin {{head_branch}}
    </action>
    
    <action>Create PR using mcp_GitHub_create_pull_request:
      - owner: {{repo_owner}}
      - repo: {{repo_name}}
      - title: {{pr_title}}
      - body: {{pr_body}}
      - head: {{head_branch}}
      - base: {{base_branch}}
      - draft: false (or ask user if they want draft PR)
    </action>
    
    <action>Store PR number and URL from response</action>
    
    <action>If PR creation fails:
      - Check error message
      - If branch conflict: Inform user and suggest resolution
      - If permission issue: Inform user to check GitHub permissions
      - HALT with error message
    </action>
  </step>

  <step n="8" goal="Update ticket status to in-review">
    <action>Update task ticket status to "inreview" using mcp_vibe_kanban_update_task:
      - task_id: {{task_ticket_id}}
      - status: "inreview"
    </action>
    
    <action>Verify ticket status was updated successfully</action>
    
    <action>Optionally update ticket description with PR link:
      - Get current ticket description
      - Append PR link: "\n\n**Pull Request:** {{pr_url}}"
      - Update ticket description using mcp_vibe_kanban_update_task
    </action>
  </step>

  <step n="9" goal="Report PR creation">
    <output>**? Pull Request Created Successfully, {user_name}!**

**Task Ticket:** {{task_ticket_id}} - {{ticket_title}}
**Ticket Status:** Updated to "inreview"

**Pull Request:**
- Number: #{{pr_number}}
- URL: {{pr_url}}
- Title: {{pr_title}}

**Branch Information:**
- Base: {{base_branch}} (work started branch)
- Head: {{head_branch}} (current task branch)

**Next Steps:**
1. Review the PR in GitHub: {{pr_url}}
2. Wait for code review
3. Address review comments if needed
4. Merge PR when approved
5. Ticket status will remain "inreview" until PR is merged
    </output>
  </step>

</workflow>
