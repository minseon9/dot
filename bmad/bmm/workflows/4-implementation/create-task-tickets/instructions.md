# Create Task Tickets - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates Kanban tickets for each task in a story, with code-level implementation plans based on architecture and story tasks.</critical>
<critical>Uses Vibe Kanban MCP tools for ticket management.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly. If Korean text appears as ???, re-read the file with explicit UTF-8 encoding or re-save it.</critical>

<workflow>

  <step n="1" goal="Load config and identify story">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language, document_output_language</action>
    <action>If {{story_file}} not provided and {{story_key}} provided:
      - Construct path: {{story_dir}}/{{story_key}}.md
      - Load story file with UTF-8 encoding
    </action>
    <action>If {{story_file}} provided:
      - Load the COMPLETE story file with UTF-8 encoding
      - Verify Korean characters are preserved correctly
      - Extract story_key, epic_num, story_num, story_title, status
    </action>
    <action>If {{story_ticket_id}} not provided:
      - Check story file for "Vibe Kanban Ticket" section
      - Extract ticket_id if found
    </action>
    <action>If {{project_id}} not provided:
      - List available Vibe Kanban projects using mcp_vibe_kanban_list_projects
      - If only one project exists: Use that project_id automatically
      - If multiple projects: Ask user to select (non-interactive: use first project)
      - Store selected project_id
    </action>
  </step>

  <step n="2" goal="Load architecture document">
    <action>If {{architecture_file}} not provided:
      - Auto-discover architecture document:
        * Check {output_folder}/architecture*.md
        * Check {output_folder}/ddd/strategic-design.md
        * Check {output_folder}/ddd/tactical-design.md
        * Check {output_folder}/ddd/integration-design.md
      - If found: Load with UTF-8 encoding
      - If not found: Continue without architecture (tasks will be based on story only)
    </action>
    <action>If {{architecture_file}} provided:
      - Load architecture document with UTF-8 encoding
      - Verify Korean characters are preserved correctly
    </action>
    <action>Extract from architecture document (if loaded):
      - Implementation patterns
      - Technology stack details
      - API contracts
      - Component structure
      - Coding standards
      - Integration patterns
    </action>
  </step>

  <step n="3" goal="Extract and analyze story tasks">
    <action>Parse story file completely:
      - Extract all Tasks/Subtasks sections
      - Extract Acceptance Criteria
      - Extract Dev Notes (technical context)
      - Extract File List (if exists)
      - Extract Architecture references
    </action>
    <action>For each task/subtask in story:
      - Identify task type (Backend, Frontend, Mobile, or General)
      - Extract task description and requirements
      - Identify dependencies on other tasks
      - Determine priority (if specified in story)
    </action>
    <action>Filter tasks based on {{agent_type}}:
      - agent_type == "backend": Only Backend tasks
      - agent_type == "mobile" or "flutter": Mobile tasks (may include Frontend if applicable)
      - agent_type == "frontend": Only Frontend tasks
      - agent_type not set: All tasks
    </action>
  </step>

  <step n="4" goal="Decompose tasks into code-level implementation plans">
    <action>For each filtered task, create detailed implementation plan:
      
      **Backend Tasks:**
      - Identify specific files/components to create/modify:
        * Service classes (e.g., `UserService.kt`, `AuthService.kt`)
        * Controller classes (e.g., `UserController.kt`)
        * Repository interfaces/implementations
        * Entity classes
        * DTO classes
        * Configuration classes
      - Define API endpoints:
        * HTTP method (GET, POST, PUT, DELETE, etc.)
        * Path (e.g., `/api/v1/users/{id}`)
        * Request/Response DTOs
        * Error handling
      - Database changes:
        * Schema changes (tables, columns, indexes)
        * Migration scripts needed
        * Data model changes
      - Dependencies:
        * External libraries to add
        * Internal services to integrate
        * Configuration changes
      - Test plan:
        * Unit tests for services
        * Integration tests for controllers
        * API contract tests

      **Frontend/Mobile Tasks:**
      - Identify specific files/components to create/modify:
        * Screen/Page components
        * Widget components
        * State management files
        * API client files
        * Navigation/routing files
      - UI/UX details:
        * Figma design references (if available)
        * Component hierarchy
        * State management approach
        * User interactions
      - API integration:
        * Endpoints to call
        * Request/Response handling
        * Error handling UI
      - Dependencies:
        * Packages to add
        * Design system components
      - Test plan:
        * Widget tests
        * Integration tests
        * UI interaction tests
    </action>
    <action>Use architecture document to inform implementation:
      - Apply coding patterns from architecture
      - Follow component structure from architecture
      - Use API contracts from architecture
      - Follow naming conventions
    </action>
    <action>Determine task dependencies and order:
      - Build dependency graph
      - Calculate priority order
      - Identify parallelizable tasks
    </action>
  </step>

  <step n="5" goal="Create task tickets in Vibe Kanban">
    <critical>TICKET NAMING CONVENTION: [{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}</critical>
    <critical>WORK TYPE MAPPING: backend ? BE, mobile ? MB, frontend ? FE</critical>
    <action>Extract story number from {{story_key}}:
      - Parse story_key format: "{{epic_num}}-{{story_num}}-{{story_name}}"
      - Extract story_number: "{{epic_num}}-{{story_num}}" (e.g., "2-1" from "2-1-user-auth")
      - Store as {{story_number}}
    </action>
    <action>Map agent_type to work type prefix:
      - agent_type == "backend" ? work_type = "BE"
      - agent_type == "mobile" ? work_type = "MB"
      - agent_type == "frontend" ? work_type = "FE"
      - Store as {{work_type}}
    </action>
    <action>Sort tasks by priority and dependencies</action>
    
    <action>Initialize ticket_index = 1</action>
    
    <action>For each task (in priority order):
      <action>Prepare ticket description with code-level details:
        Format:
        ```
        **Parent Story:** {{story_key}} - {{story_title}}
        **Task Number:** {{task_number}}
        **Type:** {{task_type}} ({{agent_type}})
        **Work Type:** {{work_type}}
        **Story Number:** {{story_number}}
        **Ticket Index:** {{ticket_index}}
        
        **Problem:**
        [Task-specific problem/requirement from story]

        **Acceptance Criteria:**
        [Task-specific ACs from story]

        **Implementation Plan:**

        **Files to Create/Modify:**
        - [File 1: path, purpose, key changes]
        - [File 2: path, purpose, key changes]
        ...

        **Code-Level Tasks:**
        - [ ] [Specific code task 1 - e.g., "Create UserService.kt with registerUser() method"]
        - [ ] [Specific code task 2 - e.g., "Add validation for email format"]
        - [ ] [Specific code task 3 - e.g., "Create UserRepository interface"]
        ...

        **API Endpoints (if Backend):**
        - [Endpoint 1: method, path, request DTO, response DTO]
        - [Endpoint 2: method, path, request DTO, response DTO]
        ...

        **UI Components (if Frontend/Mobile):**
        - [Component 1: name, location, Figma link, purpose]
        - [Component 2: name, location, Figma link, purpose]
        ...

        **Database Changes (if Backend):**
        - [Change 1: table, columns, migration script]
        - [Change 2: table, columns, migration script]
        ...

        **Dependencies:**
        - [Dependency 1: library/package, version]
        - [Dependency 2: library/package, version]
        ...

        **Test Plan:**
        - [ ] [Test 1: type, scope, what to verify]
        - [ ] [Test 2: type, scope, what to verify]
        ...

        **Dependencies on Other Tasks:**
        - [Task number/name that must be completed first]
        ...

        **References:**
        - Story: {{story_file}}
        - Story Ticket: {{story_ticket_id}}
        - Architecture: {{architecture_file}}
        ```
      </action>
      
      <action>Create ticket title using naming convention:
        - Format: "[{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}"
        - Example: "[MB-2-1-1] ??? ?? ?? ??"
        - Example: "[BE-2-1-1] ??? ?? API ??"
        - Store as {{ticket_title}}
      </action>
      
      <action>Create ticket using mcp_vibe_kanban_create_task:
        - project_id: {{project_id}}
        - title: {{ticket_title}}
        - description: {{ticket_description}}
      </action>
      
      <action>Store ticket_id for this task</action>
      <action>Store ticket_index for this task (for reference)</action>
      <action>Increment ticket_index for next task</action>
    </action>
  </step>

  <step n="6" goal="Update story file with task ticket references">
    <action>Load story file with UTF-8 encoding</action>
    <action>Add "## Task Tickets" section if not exists:
      - List all created task tickets with:
        * Task number
        * Ticket ID
        * Ticket title
        * Priority
        * Dependencies
    </action>
    <action>Save story file with UTF-8 encoding</action>
    <action>Verify Korean characters are preserved correctly after save</action>
  </step>

  <step n="7" goal="Report ticket creation results">
    <action>Prepare summary of created tickets:
      - Total tickets created
      - Ticket IDs and titles
      - Priority order
      - Dependencies
    </action>
    <output>**? Task Tickets Created Successfully, {user_name}!**

**Story:** {{story_key}} - {{story_title}}

**Created Task Tickets ({{ticket_count}}):**

{{ticket_list_with_priority}}

**Priority Order:**
{{priority_order}}

**Next Steps:**
1. Review task tickets in Vibe Kanban
2. Run `review-task-tickets` workflow to review implementation plans
3. Begin work on tickets in priority order
4. Use `dev-story` workflow to implement tasks
    </output>
  </step>

</workflow>
