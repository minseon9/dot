# Manage Git Worktree - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow manages git worktrees for agent-specific work. Each agent gets their own worktree to avoid conflicts.</critical>
<critical>Uses git commands to create, manage, and clean up worktrees.</critical>

<workflow>

  <step n="1" goal="Load config and determine agent type">
    <action>Resolve variables from config_source: project_root, user_name, communication_language</action>
    <action>If {{agent_name}} not provided:
      - Try to detect from context (calling agent)
      - If Spring Backend Dev Agent: agent_name = "spring-backend-dev", agent_type = "backend"
      - If Flutter Dev Agent: agent_name = "flutter-dev", agent_type = "mobile"
      - Otherwise: ask user for agent_name and agent_type
    </action>
    <action>If {{agent_type}} not provided:
      - Map agent_name to agent_type:
        * "spring-backend-dev" ? "backend"
        * "flutter-dev" ? "mobile"
        * "frontend-dev" ? "frontend"
      - If unknown: ask user
    </action>
    <action>Verify git repository exists at {{project_root}}/.git</action>
    <action>If git repository not found: HALT with error "Git repository required for worktree management"</action>
  </step>

  <step n="2" goal="Determine worktree path">
    <critical>WORKTREE PATH PRIORITY: Explicit worktree_path > story_key-based generation</critical>
    <action>If {{worktree_path}} provided and is absolute path:
      - Use provided path as-is
      - Verify path format (should be under {{project_root}}/.worktrees/)
    </action>
    <action>If {{worktree_path}} provided but is relative path:
      - Resolve to absolute path: {{project_root}}/{{worktree_path}}
      - Normalize path
    </action>
    <action>If {{worktree_path}} NOT provided:
      - If {{story_key}} provided:
        - Sanitize story_key (replace invalid path chars with hyphens)
        - Generate worktree path: {{project_root}}/.worktrees/{{agent_type}}-{{story_key}}
      - If {{story_key}} NOT provided:
        - Generate worktree path: {{project_root}}/.worktrees/{{agent_type}}
    </action>
    <action>Normalize worktree path (resolve relative paths, ensure absolute path)</action>
    <action>Store worktree_path for later use</action>
  </step>

  <step n="3" goal="Execute action">
    <check if="action == 'create' or action not provided">
      <critical>SAME STORY, SAME WORKTREE: If worktree exists for this story, reuse it. Only create new branch.</critical>
      <action>Check if worktree already exists at {{worktree_path}} using: git worktree list</action>
      <action>If worktree exists:
        - Check if it's valid (git worktree list shows it)
        - If valid: 
          * Use existing worktree (same story uses same worktree)
          * Get current branch in worktree: cd {{worktree_path}} && git branch --show-current
          * If {{branch_name}} provided:
            - If {{branch_name}} == current branch: Use existing worktree as-is
            - If {{branch_name}} != current branch:
              - Check if branch exists: git branch --list {{branch_name}}
              - If branch does NOT exist:
                - Create new branch from {{base_branch}}: git branch {{branch_name}} {{base_branch}}
              - Switch to new branch in worktree: cd {{worktree_path}} && git checkout {{branch_name}}
              - Verify branch switch succeeded
          * Store existing worktree_path
        - If invalid: Remove and recreate
      </action>
      <action>If worktree does NOT exist:
        - Determine branch name:
          * If {{branch_name}} provided: Use {{branch_name}} (sanitize if needed)
          * If {{branch_name}} NOT provided:
            - If {{story_key}} provided: {{agent_type}}/{{story_key}}
            - If {{story_key}} NOT provided: {{agent_type}}/work
        - Sanitize branch name (replace invalid chars with hyphens)
        - Check if branch already exists: git branch --list {{branch_name}}
        - If branch does NOT exist:
          ```
          git worktree add -b {{branch_name}} {{worktree_path}} {{base_branch}}
          ```
        - If branch already exists:
          ```
          git worktree add {{worktree_path}} {{branch_name}}
          ```
      </action>
      <action>Verify worktree was created or found successfully</action>
      <action>Set worktree_path variable for use by other workflows</action>
      <action>Set branch_name variable (current branch in worktree)</action>
      <output>**? Git Worktree Ready**

**Worktree Details:**
- Path: {{worktree_path}}
- Branch: {{branch_name}}
- Agent: {{agent_name}} ({{agent_type}})
- Story: {{story_key}}
- Base Branch: {{base_branch}}

**Next Steps:**
1. Use {{worktree_path}} as your working directory
2. All file operations should be in this worktree
3. Commit changes in this worktree
4. Run `manage-git-worktree` with action="remove" when done
      </output>
    </check>

    <check if="action == 'get'">
      <action>If {{worktree_path}} provided:
        - Check if worktree exists at that path using: git worktree list
        - If found: Use provided path
        - If not found: Continue with search
      </action>
      <action>If {{worktree_path}} NOT provided:
        - Calculate expected worktree path:
          * If {{story_key}} provided: {{project_root}}/.worktrees/{{agent_type}}-{{story_key}}
          * If {{story_key}} NOT provided: {{project_root}}/.worktrees/{{agent_type}}
        - List all worktrees using: git worktree list
        - Find worktree matching:
          * Path contains: {{agent_type}}-{{story_key}} (if story_key provided)
          * Or path contains: {{agent_type}} (if story_key not provided)
      </action>
      <action>If worktree found:
        - Extract path and branch from git worktree list output
        - Set worktree_path variable
        - Set branch_name variable (current branch in worktree)
      </action>
      <action>If worktree NOT found:
        - Ask if user wants to create one with action="create"
        - Or return empty worktree_path
      </action>
      <output>**?? Git Worktree Status**

<check if="worktree found">
**Found Worktree:**
- Path: {{worktree_path}}
- Branch: {{branch_name}}
- Agent: {{agent_name}} ({{agent_type}})
- Story: {{story_key}}
</check>

<check if="worktree not found">
**No worktree found for:**
- Agent: {{agent_name}} ({{agent_type}})
- Story: {{story_key}}

Run with action="create" to create a new worktree.
</check>
      </output>
    </check>

    <check if="action == 'remove'">
      <action>Verify worktree exists at {{worktree_path}}</action>
      <action>Check if worktree has uncommitted changes:
        - cd {{worktree_path}}
        - git status --porcelain
      </action>
      <action>If uncommitted changes exist:
        - Ask user: "Worktree has uncommitted changes. Remove anyway? (y/n)"
        - If no: HALT
        - If yes: Continue
      </action>
      <action>Remove worktree using:
        ```
        git worktree remove {{worktree_path}}
        ```
      </action>
      <action>If removal fails (force needed):
        ```
        git worktree remove --force {{worktree_path}}
        ```
      </action>
      <action>Verify worktree was removed</action>
      <output>**? Git Worktree Removed**

**Removed:**
- Path: {{worktree_path}}
- Branch: {{branch_name}}

Worktree has been cleaned up.
      </output>
    </check>

    <check if="action == 'list'">
      <action>List all worktrees using: git worktree list</action>
      <action>Parse worktree list and extract:
        - Path
        - Branch
        - Commit
        - Status
      </action>
      <action>Group by agent type if possible</action>
      <output>**?? Git Worktrees**

{{worktree_list}}

**Total:** {{worktree_count}} worktrees
      </output>
    </check>
  </step>

  <step n="4" goal="Save worktree info">
    <action>If worktree created or found:
      - Save worktree info to: {{output_folder}}/worktrees/{{agent_type}}-{{story_key}}.yaml
      - Include: path, branch, agent_name, agent_type, story_key, created_date
    </action>
    <action>Update story file (if {{story_file}} provided):
      - Add "## Git Worktree" section
      - Include worktree_path and branch_name
    </action>
  </step>

</workflow>
