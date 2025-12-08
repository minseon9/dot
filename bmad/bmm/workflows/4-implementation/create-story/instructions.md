# Create Story - Workflow Instructions (Spec-compliant, non-interactive by default)

````xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow creates or updates the next user story from epics/PRD and architecture context, saving to the configured stories directory and optionally invoking Story Context.</critical>
<critical>DOCUMENT OUTPUT: Concise, technical, actionable story specifications. Use tables/lists for acceptance criteria and tasks.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly. If story file contains Korean text, use cat command with heredoc to save with UTF-8 encoding (see {project-root}/docs/encoding-fix-method.md solution 1).</critical>

## 📚 Document Discovery - Selective Epic Loading

**Strategy**: This workflow needs only ONE specific epic and its stories, not all epics. This provides huge efficiency gains when epics are sharded.

**Epic Discovery Process (SELECTIVE OPTIMIZATION):**

1. **Determine which epic** you need (epic_num from story context - e.g., story "3-2-feature-name" needs Epic 3)
2. **Check for sharded version**: Look for `epics/index.md`
3. **If sharded version found**:
   - Read `index.md` to understand structure
   - **Load ONLY `epic-{epic_num}.md`** (e.g., `epics/epic-3.md` for Epic 3)
   - DO NOT load all epic files - only the one needed!
   - This is the key efficiency optimization for large multi-epic projects
4. **If whole document found**: Load the complete `epics.md` file and extract the relevant epic

**Other Documents (prd, architecture, ux-design) - Full Load:**

1. **Search for whole document first** - Use fuzzy file matching
2. **Check for sharded version** - If whole document not found, look for `{doc-name}/index.md`
3. **If sharded version found**:
   - Read `index.md` to understand structure
   - Read ALL section files listed in the index
   - Treat combined content as single document
4. **Brownfield projects**: The `document-project` workflow creates `{output_folder}/docs/index.md`

**Priority**: If both whole and sharded versions exist, use the whole document.

**UX-Heavy Projects**: Always check for ux-design documentation as it provides critical context for UI-focused stories.

<workflow>

  <step n="1" goal="Load config and initialize">
    <action>Resolve variables from config_source: story_dir (dev_story_location), output_folder, user_name, communication_language. If story_dir missing and {{non_interactive}} == false → ASK user to provide a stories directory and update variable. If {{non_interactive}} == true and missing, HALT with a clear message.</action>
    <action>Create {{story_dir}} if it does not exist</action>
    <action>Resolve installed component paths from workflow.yaml: template, instructions, validation</action>
    <action>Resolve recommended inputs if present: epics_file, prd_file, architecture_file</action>
  </step>

  <step n="2" goal="Discover and load source documents">
    <critical>PREVIOUS STORY CONTINUITY: Essential for maintaining context and learning from prior development</critical>

    <action>Find the previous completed story to extract dev agent learnings and review findings:
      1. Load {{epics_file}} to understand story order within epic
      2. Identify previous story in same epic (story_num - 1) or previous epic's last story
      3. If previous story exists:
         - Extract {{previous_story_key}} from epics.md structure
         - Construct path: {{story_dir}}/{{previous_story_key}}.md
         - Check if previous story file exists
         - If exists, load the COMPLETE previous story file
         - Parse ALL sections comprehensively:

             A) Dev Agent Record → Completion Notes List:
                - New patterns/services created (to reuse, not recreate)
                - Architectural deviations or decisions made
                - Technical debt deferred to future stories
                - Warnings or recommendations for next story
                - Interfaces/methods created for reuse

             B) Dev Agent Record → Debug Log References:
                - Issues encountered and solutions
                - Gotchas or unexpected challenges
                - Workarounds applied

             C) Dev Agent Record → File List:
                - Files created (NEW) - understand new capabilities
                - Files modified (MODIFIED) - track evolving components
                - Files deleted (DELETED) - removed functionality

             D) Dev Notes:
                - Any "future story" notes or TODOs
                - Patterns established
                - Constraints discovered

             E) Senior Developer Review (AI) section (if present):
                - Review outcome (Approve/Changes Requested/Blocked)
                - Unresolved action items (unchecked [ ] items)
                - Key findings that might affect this story
                - Architectural concerns raised

             F) Senior Developer Review → Action Items (if present):
                - Check for unchecked [ ] items still pending
                - Note any systemic issues that apply to multiple stories

             G) Review Follow-ups (AI) tasks (if present):
                - Check for unchecked [ ] review tasks still pending
                - Determine if they're epic-wide concerns

             H) Story Status:
                - If "review" or "in-progress" - incomplete, note what's pending
                - If "done" - confirmed complete
           * Store ALL findings as {{previous_story_learnings}} with structure:
             - new_files: [list]
             - modified_files: [list]
             - new_services: [list with descriptions]
             - architectural_decisions: [list]
             - technical_debt: [list]
             - warnings_for_next: [list]
             - review_findings: [list if review exists]
             - pending_items: [list of unchecked action items]
         - If previous story file doesn't exist:
           * Set {{previous_story_learnings}} = "Previous story not yet implemented"
      4. If no previous story exists (first story in epic):
         - Set {{previous_story_learnings}} = "First story in epic - no predecessor context"
    </action>

    <action>If {{tech_spec_file}} empty: derive from {{tech_spec_glob_template}} with {{epic_num}} and search {{tech_spec_search_dir}} recursively. If multiple, pick most recent by modified time.</action>
    <action>Build a prioritized document set for this epic:
      1) tech_spec_file (epic-scoped)
      2) epics_file (acceptance criteria and breakdown)
      3) prd_file (business requirements and constraints)
      4) architecture_file (architecture constraints)
      5) Architecture docs under docs/ and output_folder/: tech-stack.md, unified-project-structure.md, coding-standards.md, testing-strategy.md, backend-architecture.md, frontend-architecture.md, data-models.md, database-schema.md, rest-api-spec.md, external-apis.md (include if present)
    </action>
    <action>READ COMPLETE FILES for all items found in the prioritized set. Store content and paths for citation.</action>
  </step>

  <step n="3" goal="Find next story to draft from epics">
    <critical>KANBAN MODE: Find next story from epics.md, not sprint-status.yaml. Support priority and milestone for rough scheduling.</critical>
    
    <action>Load {{epics_file}} completely to understand epic and story structure</action>
    <action>If {{epic_num}} and {{story_num}} provided:
      - Use provided values
      - Construct story_key: "{{epic_num}}-{{story_num}}-{{story_title}}"
    </action>
    
    <action>If {{epic_num}} and {{story_num}} NOT provided:
      - Scan epics.md for all stories
      - For each story, check if story file exists in {{story_dir}}
      - Find the FIRST story where:
        * Story is listed in epics.md
        * Story file does NOT exist in {{story_dir}}
        * Or story file exists but status is "drafted" (can be updated)
      - Extract epic_num, story_num, story_title from epics.md
      - Construct story_key: "{{epic_num}}-{{story_num}}-{{story_title}}"
    </action>

    <check if="no story found to create">
      <output>📋 No stories found to create

All stories from epics.md have been created.

**Options:**
1. Load PM agent and run correct-course to add more stories to epics.md
2. Review existing stories in {{story_dir}}
      </output>
      <action>HALT</action>
    </check>

    <action>Extract from story key (e.g., "1-2-user-authentication"):
      - epic_num: first number before dash (e.g., "1")
      - story_num: second number after first dash (e.g., "2")
      - story_title: remainder after second dash (e.g., "user-authentication")
    </action>
    <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>
    <action>Store story_key for later use (e.g., "1-2-user-authentication")</action>

    <action>Extract from epics.md for this story:
      - Priority (if specified in epics.md, otherwise ask user or set default)
      - Milestone (if specified in epics.md, otherwise ask user or leave empty)
      - Acceptance criteria
      - Story description
    </action>

    <action>If priority not found in epics.md and {{non_interactive}} == false:
      - Ask user: "What priority should this story have? (P0=Critical, P1=High, P2=Medium, P3=Low)"
      - Store priority value
    </action>
    <action>If priority not found and {{non_interactive}} == true:
      - Set default priority: "P2" (Medium)
    </action>

    <action>If milestone not found in epics.md and {{non_interactive}} == false:
      - Ask user: "What milestone should this story target? (e.g., 'Q1 2025', 'MVP', 'Phase 2', or leave empty)"
      - Store milestone value (can be empty)
    </action>
    <action>If milestone not found and {{non_interactive}} == true:
      - Leave milestone empty (can be set later)
    </action>

    <action>Check if story file already exists at expected path in {{story_dir}}</action>
    <check if="story file exists">
      <output>ℹ️ Story file already exists: {{story_file_path}}

Will update existing story file rather than creating new one.
      </output>
      <action>Set update_mode = true</action>
      <action>Load existing story file to preserve priority and milestone if already set</action>
    </check>
  </step>

  <step n="4" goal="Extract requirements and derive story statement">
    <action>From tech_spec_file (preferred) or epics_file: extract epic {{epic_num}} title/summary, acceptance criteria for the next story, and any component references. If not present, fall back to PRD sections mapping to this epic/story.</action>
    <action>From architecture and architecture docs: extract constraints, patterns, component boundaries, and testing guidance relevant to the extracted ACs. ONLY capture information that directly informs implementation of this story.</action>
    <action>Derive a clear user story statement (role, action, benefit) grounded strictly in the above sources. If ambiguous and {{non_interactive}} == false → ASK user to clarify. If {{non_interactive}} == true → generate the best grounded statement WITHOUT inventing domain facts.</action>
    <template-output file="{default_output_file}">requirements_context_summary</template-output>
  </step>

  <step n="5" goal="Project structure alignment and lessons learned">
    <action>Review {{previous_story_learnings}} and extract actionable intelligence:
      - New patterns/services created → Note for reuse (DO NOT recreate)
      - Architectural deviations → Understand and maintain consistency
      - Technical debt items → Assess if this story should address them
      - Files modified → Understand current state of evolving components
      - Warnings/recommendations → Apply to this story's approach
      - Review findings → Learn from issues found in previous story
      - Pending action items → Determine if epic-wide concerns affect this story
    </action>

    <action>If unified-project-structure.md present: align expected file paths, module names, and component locations; note any potential conflicts.</action>

    <action>Cross-reference {{previous_story_learnings}}.new_files with project structure to understand where new capabilities are located.</action>

    <template-output file="{default_output_file}">structure_alignment_summary</template-output>
  </step>

  <step n="6" goal="Assemble acceptance criteria and tasks">
    <action>Assemble acceptance criteria list from tech_spec or epics. If gaps exist, derive minimal, testable criteria from PRD verbatim phrasing (NO invention).</action>
    <action>Create tasks/subtasks directly mapped to ACs. Include explicit testing subtasks per testing-strategy and existing tests framework. Cite architecture/source documents for any technical mandates.</action>
    <template-output file="{default_output_file}">acceptance_criteria</template-output>
    <template-output file="{default_output_file}">tasks_subtasks</template-output>
  </step>

  <step n="7" goal="Create or update story document">
    <action>Resolve output path: {default_output_file} using current {{epic_num}} and {{story_num}}. If targeting an existing story for update, use its path.</action>
    <action>Initialize from template.md if creating a new file; otherwise load existing file for edit.</action>
    <action>Compute a concise story_title from epic/story context; if missing, synthesize from PRD feature name and epic number.</action>
    <template-output file="{default_output_file}">story_header</template-output>
    <template-output file="{default_output_file}">story_body</template-output>
    <template-output file="{default_output_file}">dev_notes_with_citations</template-output>

    <action>If {{previous_story_learnings}} contains actionable items (not "First story" or "not yet implemented"):
      - Add "Learnings from Previous Story" subsection to Dev Notes
      - Include relevant completion notes, new files/patterns, deviations
      - Cite previous story file as reference [Source: stories/{{previous_story_key}}.md]
      - Highlight interfaces/services to REUSE (not recreate)
      - Note any technical debt to address in this story
      - List pending review items that affect this story (if any)
      - Reference specific files created: "Use {{file_path}} for {{purpose}}"
      - Format example:
        ```
        ### Learnings from Previous Story

        **From Story {{previous_story_key}} (Status: {{previous_status}})**

        - **New Service Created**: `AuthService` base class available at `src/services/AuthService.js` - use `AuthService.register()` method
        - **Architectural Change**: Switched from session-based to JWT authentication
        - **Schema Changes**: User model now includes `passwordHash` field, migration applied
        - **Technical Debt**: Email verification skipped, should be included in this or subsequent story
        - **Testing Setup**: Auth test suite initialized at `tests/integration/auth.test.js` - follow patterns established there
        - **Pending Review Items**: Rate limiting mentioned in review - consider for this story

        [Source: stories/{{previous_story_key}}.md#Dev-Agent-Record]
        ```
    </action>

    <template-output file="{default_output_file}">change_log</template-output>
  </step>

  <step n="8" goal="Validate, save, and finalize story">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
    
    <action>After validation completes, check validation report:
      - Load validation report file (validation-report-*.md in story directory)
      - Check "Overall" result in Summary section
      - If result shows "PASS" or "PASS with issues" (Critical Issues: 0): Set {{validation_passed}} = true
      - If result shows "FAIL" (Critical Issues > 0): Set {{validation_passed}} = false
      - If report not found or unclear: Ask user if validation passed
    </action>

    <action>If story file contains Korean text (check Problem Definition, Metrics, or any Korean content):
      - Use cat command with heredoc to save story file with UTF-8 encoding
      - Pattern: cat > {{default_output_file}} << 'EOF'
      - Follow {project-root}/docs/encoding-fix-method.md solution 1
      - Use single quotes around heredoc delimiter ('EOF') to prevent variable substitution
      - Verify encoding after save: file -I {{default_output_file}} should show charset=utf-8
      - NEVER use write tool for story files containing Korean text
    </action>
    <action>If story file does NOT contain Korean text:
      - Save document using write tool (normal workflow)
    </action>
    <action>Save document unconditionally (non-interactive default). In interactive mode, allow user confirmation.</action>

    <action>Ensure story file includes:
      - Priority field (P0/P1/P2/P3)
      - Milestone field (if provided)
      - Status: "drafted"
    </action>

    <check if="validation passed">
      <action>Load story file completely to extract ticket content</action>
      <action>Extract from story for ticket:
        - Story Key: {{story_key}}
        - Story Title: {{story_title}}
        - Epic: Epic {{epic_num}}
        - Priority: {{priority}}
        - Milestone: {{milestone}} (if provided)
        - Problem Definition: Extract from Story section or Dev Notes
        - Acceptance Criteria: List all ACs (numbered)
        - Key Technical Context: Extract from Dev Notes (architecture patterns, constraints, key files/components)
      </action>

      <action>Prepare concise ticket description (agent-focused, essential info only):
        - Extract problem definition: Look for "Problem:" section in Dev Notes, or derive from Story statement
        - Extract acceptance criteria: List all numbered ACs (keep concise, one line per AC)
        - Extract key technical context: From Dev Notes, extract only:
          * Architecture patterns mentioned (e.g., "Use Repository pattern", "Follow REST API conventions")
          * Key constraints (e.g., "Must use existing AuthService", "Database schema: users table")
          * Critical files/components to touch (e.g., "src/services/AuthService.ts", "app/screens/LoginScreen.dart")
          * Testing requirements if critical (e.g., "Integration tests required")
        - Omit: Detailed explanations, full citations, non-critical references
        
        Format (concise, agent-readable):
        ```
        **Story:** {{story_key}} - {{story_title}}
        **Epic:** Epic {{epic_num}}
        **Priority:** {{priority}}{{#if milestone}} | **Milestone:** {{milestone}}{{/if}}

        **Problem:**
        [One clear requirement/problem - max 2-3 sentences]

        **Acceptance Criteria:**
        1. [AC 1 - concise]
        2. [AC 2 - concise]
        ...

        **Technical Context:**
        - [Pattern/constraint 1]
        - [Pattern/constraint 2]
        - [Key file/component 1]
        - [Key file/component 2]

        **References:**
        - Story: {{story_file}}
        ```
      </action>

      <invoke-workflow path="{project-root}/bmad/bmm/workflows/4-implementation/manage-story-ticket/workflow.yaml">
        <param>story_file: {{story_file}}</param>
        <param>story_key: {{story_key}}</param>
        <param>action: create</param>
        <param>ticket_title: Story {{epic_num}}.{{story_num}}: {{story_title}}</param>
        <param>ticket_description: [Prepared concise description above]</param>
      </invoke-workflow>

      <action>Verify ticket was created successfully</action>
      <action>Update story file with ticket reference if not already added by manage-story-ticket workflow</action>
    </check>

    <action>Report created/updated story path</action>
    <output>**✅ Story Created Successfully, {user_name}!**

**Story Details:**

- Story ID: {{story_id}}
- Story Key: {{story_key}}
- File: {{story_file}}
- Priority: {{priority}}
- Milestone: {{milestone}}
- Status: drafted

**Validation:** {{validation_result}}

<check if="validation passed and ticket created">
**✅ Vibe Kanban Ticket Created:**
- Ticket ID: {{ticket_id}}
- Project ID: {{project_id}}
- Status: todo
</check>

<check if="validation failed">
**⚠️ Validation Failed:**
- Please review and fix issues before creating ticket
- Run validation again after fixes
</check>

**Next Steps:**

<check if="validation passed and ticket created">
1. Review the drafted story in {{story_file}}
2. Ticket is ready in Vibe Kanban for development
3. **[OPTIONAL]** Run `story-context` to generate technical context XML
</check>

<check if="validation passed but ticket not created">
1. Review the drafted story in {{story_file}}
2. Run `manage-story-ticket` manually to create Vibe Kanban ticket
3. **[OPTIONAL]** Run `story-context` to generate technical context XML
</check>

<check if="validation failed">
1. Fix validation issues in {{story_file}}
2. Re-run `create-story` or validation
3. After validation passes, ticket will be created automatically
</check>
    </output>
  </step>

</workflow>
````
