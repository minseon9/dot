# Update Story - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow updates existing stories with problem definition, solution results, and metrics. Each story must contain exactly one requirement.</critical>
<critical>DOCUMENT OUTPUT: Clear, structured updates to story sections with problem-solution-metrics lifecycle tracking.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly. If story file contains Korean text, use cat command with heredoc to save with UTF-8 encoding (see {project-root}/docs/encoding-fix-method.md solution 1).</critical>

<workflow>

  <step n="1" goal="Load config and identify story to update">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{story_file}} not provided:
      1. Search for story files in {{story_dir}}
      2. If multiple stories found, ask user to select
      3. If {{story_key}} provided, construct path: {{story_dir}}/{{story_key}}.md
      4. Load sprint-status.yaml to find story by key if needed
    </action>
    <action>Load the COMPLETE story file. Verify it exists and is readable.</action>
    <action>Extract story metadata: story_key, epic_num, story_num, current status</action>
    <action>Identify which sections need updating based on {{update_type}}:
      - "problem": Update problem definition section
      - "solution": Update solution results section
      - "metrics": Update metrics section
      - "all": Update all three sections
      - If empty: Ask user what to update
    </action>
  </step>

  <step n="2" goal="Gather update information">
    <check if="update_type == 'problem' or update_type == 'all'">
      <action>If problem definition missing or needs update:
        1. Review current problem section in story
        2. Ask user for problem/requirement definition (or extract from story if clear)
        3. Ensure it contains exactly ONE requirement
        4. Validate: Single, clear requirement statement
      </action>
      <template-output file="{default_output_file}">problem_definition</template-output>
    </check>

    <check if="update_type == 'solution' or update_type == 'all'">
      <action>If solution results missing or needs update:
        1. Review Dev Agent Record section for implementation details
        2. Review File List for what was created/modified
        3. Review Completion Notes for delivered features
        4. Ask user for solution summary if not clear from story
        5. Extract solution outcomes from implementation
      </action>
      <template-output file="{default_output_file}">solution_results</template-output>
    </check>

    <check if="update_type == 'metrics' or update_type == 'all'">
      <action>If metrics missing or needs update:
        1. Identify relevant metrics for this story's requirement
        2. Ask user for metrics data if available
        3. Suggest metrics based on story type:
           - User-facing: engagement, conversion, satisfaction
           - Technical: performance, reliability, error rates
           - Business: revenue impact, cost savings, efficiency
        4. Format metrics with baseline, target, and actual values
      </action>
      <template-output file="{default_output_file}">metrics</template-output>
    </check>
  </step>

  <step n="3" goal="Update story document structure">
    <action>Ensure story has required sections:
      - ## Problem Definition (requirement being solved)
      - ## Solution Results (what was delivered)
      - ## Metrics (measurable outcomes)
    </action>
    <action>If sections missing, add them in appropriate location (after Story section, before Dev Notes)</action>
    <action>Update each section with gathered information:
      1. Problem Definition: Clear requirement statement
      2. Solution Results: Summary of what was implemented
      3. Metrics: Measurable outcomes with values
    </action>
    <template-output file="{default_output_file}">story_updates</template-output>
  </step>

  <step n="4" goal="Validate story completeness">
    <action>Verify story contains exactly one requirement in Problem Definition section</action>
    <action>Check that all three sections (Problem, Solution, Metrics) are present and complete:
      - Problem Definition: Must have clear requirement
      - Solution Results: Should have implementation summary (can be empty if not yet implemented)
      - Metrics: Should have metrics definition (can be empty if not yet measured)
    </action>
    <action>Validate against checklist: {installed_path}/checklist.md</action>
  </step>

  <step n="5" goal="Save and report">
    <action>If story file contains Korean text (check updated sections):
      - Use cat command with heredoc to save story file with UTF-8 encoding
      - Pattern: cat > {{default_output_file}} << 'EOF'
      - Follow {project-root}/docs/encoding-fix-method.md solution 1
      - Use single quotes around heredoc delimiter ('EOF') to prevent variable substitution
      - Verify encoding after save: file -I {{default_output_file}} should show charset=utf-8
      - NEVER use write tool for story files containing Korean text
    </action>
    <action>If story file does NOT contain Korean text:
      - Save updated story file using write tool (normal workflow)
    </action>
    <action>Save updated story file</action>
    <action>Report what was updated</action>
    <output>**? Story Updated Successfully, {user_name}!**

**Story Details:**
- Story Key: {{story_key}}
- File: {{story_file}}
- Sections Updated: {{update_type}}

**Next Steps:**
1. Review updated story sections
2. If metrics need tracking, ensure measurement setup is in place
3. Run `manage-story-ticket` to sync with Vibe Kanban if ticket exists
    </output>
  </step>

</workflow>