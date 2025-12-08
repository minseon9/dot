# Define Requirement - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow defines a problem/requirement and creates a corresponding story. Ensures each story contains exactly one requirement.</critical>
<critical>DOCUMENT OUTPUT: Clear requirement definition with problem-solution-metrics structure.</critical>

<workflow>

  <step n="1" goal="Load config and gather requirement context">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{problem_description}} not provided:
      1. Ask user to describe the problem/requirement
      2. Guide user to be specific and focused
      3. Ensure it's a single requirement (not multiple)
    </action>
    <action>Load epic context if available:
      - Load epics.md to understand epic structure
      - Determine which epic this requirement belongs to
      - If no epic, ask user or create new epic
    </action>
    <action>Load PRD for business context if available</action>
  </step>

  <step n="2" goal="Analyze and refine requirement">
    <action>Analyze problem_description for:
      - Clarity: Is it clear what needs to be solved?
      - Specificity: Is it specific enough?
      - Single requirement: Does it contain only ONE requirement?
      - Measurability: Can success be measured?
    </action>
    <action>If multiple requirements detected:
      1. List each requirement found
      2. Ask user to select which one to focus on
      3. Note other requirements for future stories
    </action>
    <action>Refine requirement statement:
      - Make it clear and unambiguous
      - Ensure it's a single, focused requirement
      - Define success criteria
    </action>
    <template-output file="{default_output_file}">requirement_definition</template-output>
  </step>

  <step n="3" goal="Define problem statement">
    <action>Create clear problem statement:
      - Who has the problem? (user type/persona)
      - What is the problem? (specific issue)
      - Why is it a problem? (impact/need)
    </action>
    <action>Ensure problem statement:
      - Is specific and measurable
      - Focuses on single requirement
      - Can be solved with a solution
    </action>
    <action>Document in Problem Definition section</action>
    <template-output file="{default_output_file}">problem_statement</template-output>
  </step>

  <step n="4" goal="Identify success metrics">
    <action>Define metrics for measuring success:
      - What will be measured? (KPIs)
      - What is the baseline? (current state)
      - What is the target? (desired state)
      - How will it be measured? (method)
    </action>
    <action>Ensure metrics are:
      - Relevant to the problem
      - Measurable
      - Actionable
      - Aligned with business goals
    </action>
    <action>Document in Metrics section</action>
    <template-output file="{default_output_file}">metrics_definition</template-output>
  </step>

  <step n="5" goal="Determine epic and story assignment">
    <action>If {{epic_num}} not provided:
      1. Review existing epics
      2. Determine if requirement fits existing epic
      3. If no fit: Ask user to create new epic or assign to existing
      4. Store epic_num
    </action>
    <action>Determine story number:
      1. Load sprint-status.yaml
      2. Find next story number in epic
      3. Assign story_num
      4. Generate story_key: "{{epic_num}}-{{story_num}}-{{title-slug}}"
    </action>
    <action>Verify story_key is unique</action>
  </step>

  <step n="6" goal="Create story structure">
    <action>If {{create_story}} == true:
      1. Use create-story template structure
      2. Initialize story file with:
         - Story header (epic, story number, title)
         - Story statement (As a... I want... So that...)
         - Problem Definition (from step 3)
         - Solution Results (empty, to be filled during implementation)
         - Metrics (from step 4)
         - Acceptance Criteria (to be defined)
    </action>
    <action>Create story file at {{default_output_file}}</action>
    <action>Populate with requirement definition</action>
    <template-output file="{default_output_file}">story_structure</template-output>
  </step>

  <step n="7" goal="Define acceptance criteria">
    <action>Based on problem definition, create acceptance criteria:
      - Must be specific and testable
      - Must map to the problem
      - Must be complete (cover all aspects)
      - Should be measurable
    </action>
    <action>Ask user to review and refine acceptance criteria</action>
    <action>Document in Acceptance Criteria section</action>
    <template-output file="{default_output_file}">acceptance_criteria</template-output>
  </step>

  <step n="8" goal="Update sprint-status.yaml">
    <action>Add new story to sprint-status.yaml:
      - Key: {{story_key}}
      - Status: "backlog"
      - Epic: {{epic_num}}
      - Story: {{story_num}}
    </action>
    <action>Preserve existing structure and comments</action>
  </step>

  <step n="9" goal="Validate and save">
    <action>Validate story against checklist: {installed_path}/checklist.md</action>
    <action>Save story file</action>
    <action>Report creation results</action>
    <output>**? Requirement Defined and Story Created, {user_name}!**

**Story Details:**
- Story Key: {{story_key}}
- Epic: {{epic_num}}
- Story Number: {{story_num}}
- Problem: {{problem_summary}}
- File: {{story_file}}

**Next Steps:**
1. Review story definition
2. Run `validate-story` to ensure completeness
3. Run `manage-story-ticket` to create Vibe Kanban ticket
4. Proceed with implementation when ready
    </output>
  </step>

</workflow>