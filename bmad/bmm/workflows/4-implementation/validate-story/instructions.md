# Validate Story - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow validates story completeness, ensuring problem-solution-metrics lifecycle is complete and story contains exactly one requirement.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly. If Korean text appears as ???, use cat command with heredoc to fix encoding (see {project-root}/docs/encoding-fix-method.md).</critical>

<workflow>

  <step n="1" goal="Load config and identify story(ies) to validate">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{validate_all}} == true:
      1. List all story files in {{story_dir}}
      2. Load each story file for validation
    </action>
    <action>If {{story_file}} provided:
      1. Load the COMPLETE story file
      2. Extract story_key from filename or content
    </action>
    <action>If {{story_key}} provided:
      1. Construct path: {{story_dir}}/{{story_key}}.md
      2. Load story file
    </action>
    <action>If neither provided: Ask user to select story file or validate all</action>
  </step>

  <step n="2" goal="Validate story structure">
    <action>Check required sections exist:
      - Story header (title, epic, story number)
      - Story statement (As a... I want... So that...)
      - Problem Definition section
      - Solution Results section
      - Metrics section
      - Acceptance Criteria
    </action>
    <action>Verify section formatting and structure is correct</action>
    <action>Check for missing or empty sections</action>
    <template-output file="{validation_report_file}">structure_validation</template-output>
  </step>

  <step n="3" goal="Validate single requirement principle">
    <action>Read Problem Definition section carefully</action>
    <action>Analyze if it contains exactly ONE requirement:
      - Check for multiple "and" conjunctions that might indicate multiple requirements
      - Verify requirement is specific and focused
      - Identify if problem definition is too broad or vague
    </action>
    <action>If multiple requirements detected:
      - List each requirement found
      - Recommend splitting into separate stories
      - Provide specific guidance on how to split
    </action>
    <template-output file="{validation_report_file}">requirement_validation</template-output>
  </step>

  <step n="4" goal="Validate problem-solution-metrics lifecycle">
    <action>Check Problem Definition:
      - Is it clear and specific?
      - Does it define the requirement being solved?
      - Is it measurable?
    </action>
    <action>Check Solution Results:
      - If story is implemented: Does it describe what was delivered?
      - If not implemented: Section can be empty (validate as "pending")
      - Does solution align with problem definition?
    </action>
    <action>Check Metrics:
      - Are metrics defined?
      - Are they relevant to the problem?
      - If measured: Are actual values included?
      - If not measured: Section can indicate "to be measured"
    </action>
    <action>Verify lifecycle completeness:
      - Problem defined ? Solution delivered ? Metrics tracked
      - Each stage should be traceable
    </action>
    <template-output file="{validation_report_file}">lifecycle_validation</template-output>
  </step>

  <step n="5" goal="Validate acceptance criteria">
    <action>Check acceptance criteria exist and are:
      - Specific and testable
      - Mapped to the problem definition
      - Complete (cover all aspects of requirement)
    </action>
    <action>Verify criteria are not too broad or too narrow</action>
    <template-output file="{validation_report_file}">acceptance_criteria_validation</template-output>
  </step>

  <step n="6" goal="Validate Vibe Kanban ticket mapping">
    <action>Check if story has ticket_id reference</action>
    <action>If ticket_id exists:
      1. Verify ticket exists in Vibe Kanban using mcp_vibe_kanban_get_task
      2. Check ticket status aligns with story status
      3. Verify 1:1 mapping (no duplicate tickets)
    </action>
    <action>If no ticket_id:
      - Note as recommendation (not required for validation)
      - Suggest running manage-story-ticket
    </action>
    <template-output file="{validation_report_file}">ticket_validation</template-output>
  </step>

  <step n="7" goal="Generate validation report">
    <action>Compile all validation results</action>
    <action>Create summary with:
      - Overall validation status (PASS/FAIL/WARNINGS)
      - Issues found with recommendations
      - Compliant sections
      - Next steps
    </action>
    <action>If validation report contains Korean text:
      - Use cat command with heredoc to save report with UTF-8 encoding
      - Pattern: cat > {{validation_report_file}} << 'EOF'
      - Follow {project-root}/docs/encoding-fix-method.md solution 1
      - Verify encoding: file -I {{validation_report_file}} should show charset=utf-8
    </action>
    <action>If validation report does not contain Korean text:
      - Save validation report to {{validation_report_file}} using write tool
    </action>
    <action>Display validation results to user</action>
    <output>**? Story Validation Complete, {user_name}!**

**Validation Results:**
- Story: {{story_key}}
- Status: {{validation_status}}
- Issues Found: {{issue_count}}
- Warnings: {{warning_count}}

**Report Saved:** {{validation_report_file}}

**Next Steps:**
1. Review validation report for details
2. Fix any issues identified
3. Re-run validation to confirm fixes
    </output>
  </step>

</workflow>