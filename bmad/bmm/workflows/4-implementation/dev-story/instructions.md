# Develop Story - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>
<critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives other instruction.</critical>
<critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 6 decides completion.</critical>

<critical>User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly. If Korean text appears as ???, re-read the file with explicit UTF-8 encoding or re-save it.</critical>
<critical>KANBAN TICKET WORKFLOW: All work must be based on task tickets created from architecture and story. Work on tickets in priority order, update ticket status, and create PRs when tickets are complete.</critical>

<workflow>

  <step n="0.3" goal="Load task tickets for story">
    <critical>KANBAN TICKET WORKFLOW: Load task tickets before starting work</critical>
    <action>Load story file with UTF-8 encoding (if {{story_file}} or {{story_key}} available)</action>
    <action>Extract task ticket IDs from "## Task Tickets" section in story file</action>
    <action>If task tickets not found:
      - Check if story has "Vibe Kanban Ticket" section
      - Extract story_ticket_id if found
      - If story_ticket_id found, get story ticket from Vibe Kanban
      - Extract task ticket references from story ticket description
    </action>
    <action>If task tickets still not found:
      - Output: "⚠️ No task tickets found for this story. Please run `create-task-tickets` workflow first."
      - Ask user if they want to create task tickets now or proceed without tickets
      - If user chooses to proceed without tickets: Continue with story tasks only
      - If user chooses to create tickets: HALT and suggest running `create-task-tickets` workflow
    </action>
    <action>Load all task tickets from Vibe Kanban using mcp_vibe_kanban_get_task for each ticket_id</action>
    <action>Extract from each ticket:
      - Ticket ID
      - Title
      - Description (implementation plan)
      - Status (todo, inprogress, inreview, done)
      - Priority (if specified)
      - Dependencies (if specified)
    </action>
    <action>Sort tickets by priority and dependencies:
      - Tickets with dependencies must come after their dependencies
      - Higher priority tickets come first
      - Store sorted ticket list as {{task_tickets_sorted}}
    </action>
    <action>Filter tickets by status:
      - Only work on tickets with status "todo" or "inprogress"
      - Skip tickets with status "done" or "inreview"
    </action>
  </step>

  <step n="0.5" goal="Setup git worktree and branch for task">
    <critical>GIT WORKTREE: Each agent works in their own worktree to avoid conflicts</critical>
    <critical>SAME STORY, SAME WORKTREE: All tickets for the same story use the same worktree</critical>
    <critical>BRANCH MANAGEMENT: Create new branch for each task, using previous task branch as base</critical>
    <critical>TICKET NAMING CONVENTION: Parse ticket title format [{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}</critical>
    <critical>WORKTREE PATH: {{work_type}}-{{story_number}} (e.g., mobile-2-1)</critical>
    <critical>BRANCH NAME: {{work_type}}/{{story_number}}/{{ticket_index}} (e.g., mobile/2-1/1)</critical>
    <action>Determine agent type from context:
      - If Spring Backend Dev Agent: agent_type = "backend"
      - If Flutter Dev Agent: agent_type = "mobile"
      - Otherwise: detect from agent name or ask user
    </action>
    <action>If task tickets loaded:
      - Get first ticket from {{task_tickets_sorted}} (highest priority, no dependencies, status="todo" or "inprogress")
      - Get ticket title from ticket
      - Store ticket_id as {{current_task_ticket_id}}
    </action>
    <action>Parse ticket title to extract worktree and branch information:
      - Ticket title format: "[{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}"
      - Example: "[MB-2-1-1] 사용자 인증 화면 구현"
      - Extract using regex pattern: \[([A-Z]+)-([0-9]+-[0-9]+)-([0-9]+)\]
      - Extract work_type (BE, MB, FE) from ticket title prefix
      - Extract story_number (e.g., "2-1") from ticket title
      - Extract ticket_index (e.g., "1") from ticket title
      - Store as {{work_type}}, {{story_number}}, {{ticket_index}}
    </action>
    <action>If ticket title does NOT match expected format:
      - HALT with error "Ticket title must follow format: [{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}"
      - Show example: "[MB-2-1-1] 사용자 인증 화면 구현"
    </action>
    <action>Map work_type to agent_type for validation:
      - work_type == "BE" → expected agent_type = "backend"
      - work_type == "MB" → expected agent_type = "mobile"
      - work_type == "FE" → expected agent_type = "frontend"
      - Verify work_type matches agent_type, if not: WARN but continue
    </action>
    <action>If {{story_key}} NOT available yet:
      - Try to extract from story_file path if provided
      - Or construct from story_number: "{{story_number}}-{{story_name}}" (if story_name available)
      - Or wait until story_key is discovered in step 1
      - If still not available: Use story_number as story_key for worktree purposes
    </action>
    <action>Determine base branch:
      - If this is the first task (ticket_index == "1" or no previous completed tasks): base_branch = "master" (or from config)
      - If this is a subsequent task:
        * Find previous task ticket that was completed (status="done")
        * Parse previous ticket title to extract previous ticket_index
        * Calculate previous ticket_index: current_ticket_index - 1
        * Get branch name from previous task: {{work_type}}/{{story_number}}/{{previous_ticket_index}}
        * Use that branch as base_branch
      - If no previous task found: base_branch = "master"
    </action>
    <action>Create worktree path:
      - Format: {{work_type}}-{{story_number}}
      - Example: "mobile-2-1", "backend-2-1"
      - Sanitize (replace invalid chars with hyphens, lowercase)
      - Store as {{worktree_path_suffix}}
    </action>
    <action>Create branch name for current task:
      - Format: {{work_type}}/{{story_number}}/{{ticket_index}}
      - Example: "mobile/2-1/1", "backend/2-1/1"
      - Sanitize (replace invalid chars, preserve slashes)
      - Store as {{branch_name}}
    </action>
    <action>Invoke manage-git-worktree workflow with MANDATORY parameters:
      - action: "create"
      - agent_type: {{agent_type}} (for worktree path generation)
      - story_key: {{story_number}} (use story_number for worktree path)
      - worktree_path: {{project_root}}/.worktrees/{{worktree_path_suffix}} (explicit path: {{work_type}}-{{story_number}})
      - base_branch: {{base_branch}} (previous task branch or master)
      - branch_name: {{branch_name}} (format: {{work_type}}/{{story_number}}/{{ticket_index}})
    </action>
    <action>CRITICAL: Verify manage-git-worktree was invoked and returned results</action>
    <action>Store worktree_path from manage-git-worktree result</action>
    <action>Store branch_name from manage-git-worktree result (current branch in worktree)</action>
    <action>Verify worktree_path is not empty - if empty, HALT with error</action>
    <action>Verify branch_name matches expected format {{work_type}}/{{story_number}}/{{ticket_index}}</action>
    <action>Set working_directory = {{worktree_path}} for all file operations</action>
    <action>All subsequent file reads/writes MUST use {{worktree_path}} as base directory</action>
    <action>Update project_root variable to {{worktree_path}} for this workflow execution</action>
    <action>All file paths in this workflow should be relative to {{worktree_path}}, not {{project_root}}</action>
    <critical>IMPORTANT: All code files, tests, and project files MUST be created/modified in {{worktree_path}}, NOT in {{project_root}}</critical>
    <action>Update task ticket status to "inprogress" using mcp_vibe_kanban_update_task:
      - task_id: {{current_task_ticket_id}}
      - status: "inprogress"
    </action>
  </step>

  <step n="1" goal="Find next ready story and load it" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <action>If worktree_path already set (from step 0.5):
        - Use existing worktree_path
        - Verify worktree still exists
      </action>
      <action>If worktree_path NOT set (step 0.5 was skipped):
        - This should not happen if step 0.5 executed correctly
        - HALT with error "Worktree should have been created in step 0.5"
      </action>
      <goto>task_check</goto>
    </check>

    <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely to understand story order</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "ready-for-dev"
    </action>

    <check if="no ready-for-dev or in-progress story found">
      <output>📋 No ready-for-dev stories found in sprint-status.yaml
**Options:**
1. Run `story-context` to generate context file and mark drafted stories as ready
2. Run `story-ready` to quickly mark drafted stories as ready without generating context
3. Run `create-story` if no incomplete stories are drafted yet
4. Check {output-folder}/sprint-status.yaml to see current sprint status
      </output>
      <action>HALT</action>
    </check>

    <action>Store the found story_key (e.g., "1-2-user-authentication") for later status updates</action>
    <action>Find matching story file in {{story_dir}} using story_key pattern: {{story_key}}.md</action>
    <action>Read COMPLETE story file from discovered path</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>

    <action>Check if context file exists at: {{story_dir}}/{{story_key}}.context.xml</action>
    <check if="context file exists">
      <action>Read COMPLETE context file</action>
      <action>Parse all sections: story details, artifacts (docs, code, dependencies), interfaces, constraints, tests</action>
      <action>Use this context to inform implementation decisions and approaches</action>
    </check>
    <check if="context file does NOT exist">
      <output>ℹ️ No context file found for {{story_key}}

Proceeding with story file only. For better context, consider running `story-context` workflow first.
      </output>
    </check>

    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <action if="no incomplete tasks"><goto step="6">Completion sequence</goto></action>
    <action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
    <action if="incomplete task or subtask requirements ambiguous">ASK user to clarify or HALT</action>
  </step>

  <step n="1.5" goal="Detect review continuation and extract review context">
    <critical>Determine if this is a fresh start or continuation after code review</critical>

    <action>Check if "Senior Developer Review (AI)" section exists in the story file</action>
    <action>Check if "Review Follow-ups (AI)" subsection exists under Tasks/Subtasks</action>

    <check if="Senior Developer Review section exists">
      <action>Set review_continuation = true</action>
      <action>Extract from "Senior Developer Review (AI)" section:
        - Review outcome (Approve/Changes Requested/Blocked)
        - Review date
        - Total action items with checkboxes (count checked vs unchecked)
        - Severity breakdown (High/Med/Low counts)
      </action>
      <action>Count unchecked [ ] review follow-up tasks in "Review Follow-ups (AI)" subsection</action>
      <action>Store list of unchecked review items as {{pending_review_items}}</action>

      <output>⏯️ **Resuming Story After Code Review** ({{review_date}})

**Review Outcome:** {{review_outcome}}
**Action Items:** {{unchecked_review_count}} remaining to address
**Priorities:** {{high_count}} High, {{med_count}} Medium, {{low_count}} Low

**Strategy:** Will prioritize review follow-up tasks (marked [AI-Review]) before continuing with regular tasks.
      </output>
    </check>

    <check if="Senior Developer Review section does NOT exist">
      <action>Set review_continuation = false</action>
      <action>Set {{pending_review_items}} = empty</action>

      <output>🚀 **Starting Fresh Implementation**

Story: {{story_key}}
Context file: {{context_available}}
First incomplete task: {{first_task_description}}
      </output>
    </check>
  </step>

  <step n="1.6" goal="Mark story in-progress" tag="sprint-status">
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read all development_status entries to find {{story_key}}</action>
    <action>Get current status value for development_status[{{story_key}}]</action>

    <check if="current status == 'ready-for-dev'">
      <action>Update the story in the sprint status report to = "in-progress"</action>
      <output>🚀 Starting work on story {{story_key}}
Status updated: ready-for-dev → in-progress
      </output>
    </check>

    <check if="current status == 'in-progress'">
      <output>⏯️ Resuming work on story {{story_key}}
Story is already marked in-progress
      </output>
    </check>

    <check if="current status is neither ready-for-dev nor in-progress">
      <output>⚠️ Unexpected story status: {{current_status}}
Expected ready-for-dev or in-progress. Continuing anyway...
      </output>
    </check>
  </step>

  <step n="2" goal="Plan and implement task based on ticket">
    <critical>GIT WORKTREE: All file operations MUST be in {{worktree_path}}, NOT in {{project_root}}</critical>
    <critical>KANBAN TICKET WORKFLOW: Follow implementation plan from task ticket</critical>
    <action>Verify you are working in {{worktree_path}} (not {{project_root}})</action>
    <action>If task ticket loaded:
      - Review implementation plan from ticket description
      - Extract code-level tasks from ticket
      - Follow the implementation plan step by step
      - Check off completed items in ticket description as you go
    </action>
    <action>If no task ticket (fallback):
      - Review acceptance criteria and dev notes for the selected task from story
      - Plan implementation steps and edge cases
    </action>
    <action>Write down a brief plan in Dev Agent Record → Debug Log</action>
    <action>Implement the task COMPLETELY including all subtasks, critically following best practices, coding patterns and coding standards in this repo you have learned about from the story and context file or your own critical agent instructions</action>
    <action>Follow the code-level tasks from ticket implementation plan:
      - Create/modify files as specified
      - Implement API endpoints (if Backend)
      - Create UI components (if Frontend/Mobile)
      - Follow architecture patterns
    </action>
    <critical>ALL file reads/writes MUST use paths relative to {{worktree_path}}. Example: If creating src/services/AuthService.ts, use {{worktree_path}}/src/services/AuthService.ts</critical>
    <action>Handle error conditions and edge cases appropriately</action>
    <action if="new or different than what is documented dependencies are needed">ASK user for approval before adding</action>
    <action if="3 consecutive implementation failures occur">HALT and request guidance</action>
    <action if="required configuration is missing">HALT: "Cannot proceed without necessary configuration files"</action>
    <critical>Do not stop after partial progress; continue iterating tasks until all ACs are satisfied and tested or a HALT condition triggers</critical>
    <critical>Do NOT propose to pause for review, stand-ups, or validation until Step 6 gates are satisfied</critical>
  </step>

  <step n="3" goal="Author comprehensive tests">
    <critical>TEST CONVENTIONS: MUST follow test naming conventions from {project-root}/docs/architecture.md</critical>
    <critical>Backend (Spring/Kotlin) tests MUST follow backend conventions:
      - Test method naming pattern: `{테스트 내용}__given__{조건}__then__{기대값}`
      - Use `@DisplayName` annotation for Korean descriptions
      - Use `@Nested` classes to group related test cases by test subject
      - Each nested class represents a specific test subject/feature
      - Test methods within nested classes follow the naming pattern above
    </critical>
    <critical>Frontend (Flutter/Dart) tests MUST follow frontend conventions:
      - Test method naming pattern: `{테스트_항목}__given__{조건}__then__{기대값}`
      - Use `group()` function to nest test cases by test subject/feature
      - Each `group()` represents a specific test subject or feature
      - Test methods within groups follow the naming pattern above
      - Test names are in Korean and include: what is being tested, given conditions, and expected results
    </critical>
    <critical>KOREAN ENCODING: When writing test files containing Korean text, ALWAYS use `cat` command with heredoc to ensure UTF-8 encoding. Follow {project-root}/docs/encoding-fix-method.md solution 1:
      - Use `cat > {{file_path}} << 'EOF'` pattern
      - Use single quotes around heredoc delimiter ('EOF') to prevent variable substitution
      - This ensures Korean characters are preserved correctly and not corrupted to `??`
      - NEVER use `write` tool for test files containing Korean text
      - If Korean text appears as `??`, re-write the file using `cat` command with heredoc
    </critical>
    <action>Create unit tests for business logic and core functionality introduced/changed by the task</action>
    <action>Add integration tests for component interactions where desired by test plan or story notes</action>
    <action>Include end-to-end tests for critical user flows where desired by test plan or story notes</action>
    <action>Cover edge cases and error handling scenarios noted in the test plan or story notes</action>
    <action>For Spring/Kotlin tests: Follow backend test conventions from architecture.md (naming pattern, @DisplayName, @Nested structure)</action>
    <action>For Flutter/Dart tests: Follow frontend test conventions from architecture.md (naming pattern, group() structure)</action>
    <action>When writing test files with Korean text: Use `cat` command with heredoc pattern to ensure UTF-8 encoding (see encoding-fix-method.md solution 1)</action>
  </step>

  <step n="4" goal="Run validations and tests">
    <critical>GIT WORKTREE: All test execution MUST be in {{worktree_path}}</critical>
    <action>Change directory to {{worktree_path}} for all test commands</action>
    <action>Determine how to run tests for this repo (infer or use {{run_tests_command}} if provided)</action>
    <action>Run all existing tests to ensure no regressions (from {{worktree_path}})</action>
    <action>Run the new tests to verify implementation correctness (from {{worktree_path}})</action>
    <action>Run linting and code quality checks if configured (from {{worktree_path}})</action>
    <critical>IMPORTANT: All test commands must be executed from {{worktree_path}} directory, not {{project_root}}</critical>
    <action>Validate implementation meets ALL story acceptance criteria; if ACs include quantitative thresholds (e.g., test pass rate), ensure they are met before marking complete</action>
    <action if="regression tests fail">STOP and fix before continuing, consider how current changes made broke regression</action>
    <action if="new tests fail">STOP and fix before continuing</action>
  </step>

  <step n="5" goal="Mark task complete, track review resolutions, and update story">
    <critical>If task is a review follow-up, must mark BOTH the task checkbox AND the corresponding action item in the review section</critical>

    <action>Check if completed task has [AI-Review] prefix (indicates review follow-up task)</action>

    <check if="task is review follow-up">
      <action>Extract review item details (severity, description, related AC/file)</action>
      <action>Add to resolution tracking list: {{resolved_review_items}}</action>

      <!-- Mark task in Review Follow-ups section -->
      <action>Mark task checkbox [x] in "Tasks/Subtasks → Review Follow-ups (AI)" section</action>

      <!-- CRITICAL: Also mark corresponding action item in review section -->
      <action>Find matching action item in "Senior Developer Review (AI) → Action Items" section by matching description</action>
      <action>Mark that action item checkbox [x] as resolved</action>

      <action>Add to Dev Agent Record → Completion Notes: "✅ Resolved review finding [{{severity}}]: {{description}}"</action>
    </check>

    <action>ONLY mark the task (and subtasks) checkbox with [x] if ALL tests pass and validation succeeds</action>
    <action>Update File List section with any new, modified, or deleted files (paths relative to repo root, but files are in {{worktree_path}})</action>
    <critical>IMPORTANT: File paths in File List should be relative to repo root (e.g., "src/services/AuthService.ts"), but actual files exist in {{worktree_path}}</critical>
    <action>Add completion notes to Dev Agent Record if significant changes were made (summarize intent, approach, and any follow-ups)</action>

    <check if="review_continuation == true and {{resolved_review_items}} is not empty">
      <action>Count total resolved review items in this session</action>
      <action>Add Change Log entry: "Addressed code review findings - {{resolved_count}} items resolved (Date: {{date}})"</action>
    </check>

    <action>Save the story file</action>
    <action>Determine if more incomplete tasks remain</action>
    <action if="more tasks remain">
      - Update current task ticket status to "done" using mcp_vibe_kanban_update_task
      - Get next task ticket from {{task_tickets_sorted}} (highest priority, no dependencies, status="todo")
      - Get ticket title from next ticket
      - Store ticket_id as {{current_task_ticket_id}}
      - Parse next ticket title to extract worktree and branch information:
        * Format: "[{{work_type}}-{{story_number}}-{{ticket_index}}] {{task_title}}"
        * Extract work_type, story_number, ticket_index using regex: \[([A-Z]+)-([0-9]+-[0-9]+)-([0-9]+)\]
        * Store as {{work_type}}, {{story_number}}, {{ticket_index}}
      - Determine base branch from previous completed task:
        * Previous branch: {{work_type}}/{{story_number}}/{{previous_ticket_index}}
        * Calculate previous_ticket_index: current_ticket_index - 1
        * Use as base_branch
      - Create worktree path suffix: {{work_type}}-{{story_number}}
      - Create branch name for next task: {{work_type}}/{{story_number}}/{{ticket_index}}
      - Invoke manage-git-worktree workflow:
        * action: "create"
        * agent_type: {{agent_type}}
        * story_key: {{story_number}}
        * worktree_path: {{project_root}}/.worktrees/{{worktree_path_suffix}}
        * base_branch: {{base_branch}} (previous task branch: {{work_type}}/{{story_number}}/{{previous_ticket_index}})
        * branch_name: {{branch_name}} (next task branch: {{work_type}}/{{story_number}}/{{ticket_index}})
      - Store worktree_path and branch_name from result
      - Verify branch_name matches expected format {{work_type}}/{{story_number}}/{{ticket_index}}
      - Update next task ticket status to "inprogress"
      - <goto step="2">Next task</goto>
    </action>
    <action if="no tasks remain"><goto step="6">Completion</goto></action>
  </step>

  <step n="6" goal="Story completion and mark for review" tag="sprint-status">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute story definition-of-done checklist, if the story includes one</action>
    <action>Update the story Status to: review</action>

    <!-- Mark story ready for review -->
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "in-progress" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "review"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="story key not found in file">
      <output>⚠️ Story file updated, but sprint-status update failed: {{story_key}} not found

Story is marked Ready for Review in file, but sprint-status.yaml may be out of sync.
      </output>
    </check>

    <action if="any task is incomplete">Return to step 1 to complete remaining work (Do NOT finish with partial progress)</action>
    <action if="regression failures exist">STOP and resolve before completing</action>
    <action if="File List is incomplete">Update it before completing</action>
  </step>

  <step n="6.3" goal="Commit changes contextually during work">
    <critical>CONTEXTUAL COMMITS: Commit changes at meaningful points during implementation</critical>
    <action>During implementation, commit changes when:
      - A logical unit of work is complete (e.g., "Create UserService with registerUser method")
      - A file is created or significantly modified
      - Tests are added for a feature
      - A context/concern is fully addressed
    </action>
    <action>For each commit:
      - Stage related changes: git add {{specific_files}}
      - Create meaningful commit message: "feat({{agent_type}}): {{context_description}} - {{specific_change}}"
      - Example: "feat(backend): UserService - Add registerUser method with validation"
      - Commit: git commit -m "{{commit_message}}"
    </action>
    <action>Use UTF-8 encoding for commit messages (especially if Korean text is included)</action>
  </step>

  <step n="6.5" goal="Final commit and update ticket status">
    <critical>GIT WORKTREE: Final commit before marking ticket complete</critical>
    <action>Check git status in {{worktree_path}}:
      - cd {{worktree_path}}
      - git status --porcelain
    </action>
    <action>If uncommitted changes exist:
      - Stage all remaining changes: git add -A
      - Create commit message: "feat({{agent_type}}): {{story_key}} Task {{current_task_number}} - Complete implementation"
      - Commit: git commit -m "{{commit_message}}"
    </action>
    <action>Update task ticket status to "inreview" using mcp_vibe_kanban_update_task:
      - task_id: {{current_task_ticket_id}}
      - status: "inreview"
    </action>
    <action>Invoke create-pr-from-ticket workflow:
      - task_ticket_id: {{current_task_ticket_id}}
      - base_branch: {{base_branch}} (branch where work started)
      - head_branch: {{branch_name}} (current task branch)
    </action>
    <action>Note: Worktree will be kept for review. Use manage-git-worktree with action="remove" to clean up later.</action>
  </step>

  <step n="7" goal="Completion communication and user support">
    <action>Optionally run the workflow validation task against the story using {project-root}/bmad/core/tasks/validate-workflow.xml</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>
    <action>Note worktree information in completion notes:
      - Worktree path: {{worktree_path}}
      - Branch: {{branch_name}}
      - Changes committed: Yes/No
    </action>

    <action>Communicate to {user_name} that story implementation is complete and ready for review</action>
    <action>Summarize key accomplishments: story ID, story key, title, key changes made, tests added, files modified</action>
    <action>Provide the story file path and current status (now "review", was "in-progress")</action>

    <action>Based on {user_skill_level}, ask if user needs any explanations about:
      - What was implemented and how it works
      - Why certain technical decisions were made
      - How to test or verify the changes
      - Any patterns, libraries, or approaches used
      - Anything else they'd like clarified
    </action>

    <check if="user asks for explanations">
      <action>Provide clear, contextual explanations tailored to {user_skill_level}</action>
      <action>Use examples and references to specific code when helpful</action>
    </check>

    <action>Once explanations are complete (or user indicates no questions), suggest logical next steps</action>
    <action>Common next steps to suggest (but allow user flexibility):
      - Review the implemented story yourself and test the changes
      - Verify all acceptance criteria are met
      - Ensure deployment readiness if applicable
      - Run `code-review` workflow for peer review
      - Check sprint-status.yaml to see project progress
    </action>
    <action>Remain flexible - allow user to choose their own path or ask for other assistance</action>
  </step>

</workflow>
```
