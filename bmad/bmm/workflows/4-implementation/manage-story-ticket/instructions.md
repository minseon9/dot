# Manage Story Ticket - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow manages Vibe Kanban tickets with 1:1 mapping to stories. Each story has exactly one ticket.</critical>
<critical>Uses Vibe Kanban MCP tools for ticket management.</critical>

<workflow>

  <step n="1" goal="Load config and identify story">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{story_file}} not provided:
      1. Search for story files in {{story_dir}}
      2. If multiple stories found, ask user to select
      3. If {{story_key}} provided, construct path: {{story_dir}}/{{story_key}}.md
      4. Load sprint-status.yaml to find story by key if needed
    </action>
    <action>Load the COMPLETE story file. Verify it exists.</action>
    <action>Extract story metadata:
      - story_key (e.g., "1-2-user-authentication")
      - story_title
      - epic_num, story_num
      - current status (drafted, in-progress, review, done)
      - problem definition
      - acceptance criteria
    </action>
    <action>Check if story already has ticket_id stored (in story metadata or comments)</action>
    <action>Determine action:
      - If ticket_id exists: action = "update" or "sync"
      - If no ticket_id: action = "create"
      - If user specifies: use user's choice
    </action>
  </step>

  <step n="2" goal="Get or create Vibe Kanban project">
    <action>If {{project_id}} not provided:
      1. List available Vibe Kanban projects using mcp_vibe_kanban_list_projects
      2. Ask user to select project or create new one
      3. Store selected project_id
    </action>
    <action>Verify project_id is valid by listing tasks in project</action>
  </step>

  <step n="3" goal="Create new ticket (if action == 'create')">
    <check if="action == 'create'">
      <action>If {{ticket_title}} and {{ticket_description}} provided (from calling workflow):
        - Use provided title and description
      </action>
      <action>If {{ticket_title}} or {{ticket_description}} NOT provided:
        - Load story file completely
        - Extract story metadata:
          * story_key, story_title, epic_num, story_num
          * priority, milestone
          * problem definition (from Story section or Dev Notes)
          * acceptance criteria (all ACs)
          * key technical context (from Dev Notes - architecture patterns, constraints, key files)
        - Prepare concise ticket description (agent-focused):
          Format:
          ```
          **Story:** {{story_key}} - {{story_title}}
          **Epic:** Epic {{epic_num}}
          **Priority:** {{priority}} | **Milestone:** {{milestone}}

          **Problem:**
          [Problem definition - one clear requirement]

          **Acceptance Criteria:**
          1. [AC 1]
          2. [AC 2]
          ...

          **Technical Context:**
          - [Key architecture pattern/constraint 1]
          - [Key architecture pattern/constraint 2]
          - [Key files/components to touch]

          **References:**
          - Story: {{story_file}}
          ```
        - Set ticket_title: "Story {{epic_num}}.{{story_num}}: {{story_title}}"
      </action>

      <action>If {{project_id}} not provided:
        1. List available Vibe Kanban projects using mcp_vibe_kanban_list_projects
        2. If only one project exists: Use that project_id automatically
        3. If multiple projects: Ask user to select (non-interactive: use first project)
        4. Store selected project_id
      </action>

      <action>Create ticket using mcp_vibe_kanban_create_task:
        - project_id: {{project_id}}
        - title: {{ticket_title}}
        - description: {{ticket_description}}
      </action>

      <action>Store ticket_id returned from create_task</action>
      <action>Store ticket_id in story file (add to metadata section or comments)</action>
      <action>Update story file with ticket reference:
        - Add "## Vibe Kanban Ticket" section if not exists
        - Include ticket_id and project_id
        - Link to ticket if URL available
      </action>
      <template-output file="{story_file}">ticket_reference</template-output>
    </check>
  </step>

  <step n="4" goal="Update existing ticket (if action == 'update' or 'sync')">
    <check if="action == 'update' or action == 'sync'">
      <action>Get current ticket using mcp_vibe_kanban_get_task with ticket_id</action>
      <action>Compare story status with ticket status:
        - Map story status to ticket status:
          * drafted ? todo
          * in-progress ? inprogress
          * review ? inreview
          * done ? done
      </action>
      <action>If statuses differ, update ticket status using mcp_vibe_kanban_update_task</action>
      <action>Update ticket description if story has changed:
        - Problem definition updated
        - Solution results added
        - Metrics updated
        - Acceptance criteria changed
      </action>
      <action>Update ticket using mcp_vibe_kanban_update_task with latest story information</action>
    </check>
  </step>

  <step n="5" goal="Sync story status from ticket (optional)">
    <action>If syncing from ticket to story:
      1. Get ticket status from Vibe Kanban
      2. Map ticket status to story status
      3. Update story file status if different
      4. Update sprint-status.yaml if needed
    </action>
    <action>Maintain bidirectional sync capability:
      - Story ? Ticket: Primary direction (story is source of truth)
      - Ticket ? Story: Optional sync for status updates
    </action>
  </step>

  <step n="6" goal="Validate 1:1 mapping">
    <action>Verify one-to-one relationship:
      - Story has exactly one ticket_id
      - Ticket exists in Vibe Kanban
      - Ticket title matches story key pattern
    </action>
    <action>Check for duplicate tickets:
      - Search project for tickets with same story key
      - If duplicates found, warn user and consolidate
    </action>
  </step>

  <step n="7" goal="Save and report">
    <action>Save updated story file with ticket reference</action>
    <action>Report ticket management results</action>
    <output>**? Story Ticket Managed Successfully, {user_name}!**

**Ticket Details:**
- Story Key: {{story_key}}
- Ticket ID: {{ticket_id}}
- Project ID: {{project_id}}
- Action: {{action}}
- Status: {{ticket_status}}

**Next Steps:**
1. Monitor ticket status in Vibe Kanban
2. Run `manage-story-ticket` again to sync status changes
3. Update story when ticket status changes if needed
    </output>
  </step>

</workflow>