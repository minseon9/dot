# Review Task Tickets - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow reviews task tickets for implementation plan quality, completeness, and feasibility.</critical>
<critical>Uses Vibe Kanban MCP tools for ticket management.</critical>
<critical>CRITICAL: When reading/writing files with Korean text, always use UTF-8 encoding and verify Korean characters are preserved correctly.</critical>

<workflow>

  <step n="1" goal="Load config and identify tickets to review">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language, document_output_language</action>
    <action>If {{task_ticket_ids}} not provided:
      - If {{story_file}} or {{story_key}} provided:
        - Load story file with UTF-8 encoding
        - Extract task ticket IDs from "## Task Tickets" section
      - If {{story_ticket_id}} provided:
        - Get story ticket from Vibe Kanban
        - Extract task ticket references from description
    </action>
    <action>If {{project_id}} not provided:
      - Extract from first ticket or ask user
    </action>
    <action>Load all task tickets from Vibe Kanban using mcp_vibe_kanban_get_task for each ticket_id</action>
  </step>

  <step n="2" goal="Review each ticket's implementation plan">
    <action>For each task ticket, review:
      
      **1. Specificity Check:**
      - Are code-level tasks specific enough?
      - Are file paths clearly identified?
      - Are function/method names specified?
      - Are API endpoints fully defined (method, path, DTOs)?
      - Are UI components clearly described?
      
      **2. Completeness Check:**
      - Are all necessary files identified?
      - Are dependencies listed?
      - Is test plan included?
      - Are error handling scenarios considered?
      - Are edge cases addressed?
      
      **3. Feasibility Check:**
      - Can the task be completed in a reasonable time?
      - Are the technical requirements achievable?
      - Are dependencies available/accessible?
      - Is the task size appropriate (not too large, not too small)?
      
      **4. Architecture Alignment:**
      - Does the plan follow architecture patterns?
      - Are naming conventions followed?
      - Are component structures aligned?
      - Are integration patterns correct?
      
      **5. Priority and Dependencies:**
      - Is priority correctly set?
      - Are dependencies accurate?
      - Can tasks be parallelized?
      
      **6. Agent Expertise Alignment:**
      - For Backend tasks: Does it require Spring/Kotlin expertise?
      - For Mobile tasks: Does it require Flutter expertise?
      - Are domain-specific patterns used correctly?
    </action>
    <action>Score each ticket:
      - Specificity: 0-5
      - Completeness: 0-5
      - Feasibility: 0-5
      - Architecture Alignment: 0-5
      - Overall: 0-20
    </action>
  </step>

  <step n="3" goal="Identify improvements needed">
    <action>For each ticket, list:
      - Missing details
      - Unclear requirements
      - Potential issues
      - Suggested improvements
    </action>
    <action>Categorize issues:
      - **Critical**: Must fix before starting work
      - **Important**: Should fix for better quality
      - **Nice to have**: Optional improvements
    </action>
  </step>

  <step n="4" goal="Generate review report">
    <action>Create comprehensive review report:
      ```
      # Task Tickets Review Report
      
      **Story:** {{story_key}} - {{story_title}}
      **Review Date:** {{date}}
      **Total Tickets Reviewed:** {{ticket_count}}
      
      ## Summary
      - Tickets Ready: {{ready_count}}
      - Tickets Need Improvement: {{needs_improvement_count}}
      - Critical Issues: {{critical_issues_count}}
      
      ## Detailed Review
      
      ### Ticket {{ticket_id}}: {{ticket_title}}
      **Score:** {{overall_score}}/20
      - Specificity: {{specificity_score}}/5
      - Completeness: {{completeness_score}}/5
      - Feasibility: {{feasibility_score}}/5
      - Architecture Alignment: {{architecture_score}}/5
      
      **Status:** {{status}} (Ready / Needs Improvement / Critical Issues)
      
      **Issues Found:**
      {{issues_list}}
      
      **Recommendations:**
      {{recommendations_list}}
      
      ...
      ```
    </action>
    <action>Save review report to: {{output_folder}}/reviews/task-tickets-review-{{story_key}}-{{date}}.md</action>
    <action>Save with UTF-8 encoding and verify Korean characters</action>
  </step>

  <step n="5" goal="Update tickets if needed">
    <check if="{{auto_update}} == true or user approves updates">
      <action>For each ticket with improvements needed:
        - Prepare updated description with improvements
        - Update ticket using mcp_vibe_kanban_update_task:
          * task_id: {{ticket_id}}
          * description: {{updated_description}}
      </action>
      <action>Log all updates made</action>
    </check>
    
    <check if="{{auto_update}} == false and user does not approve">
      <action>Provide list of tickets that need updates</action>
      <action>Ask user if they want to update tickets now or later</action>
    </check>
  </step>

  <step n="6" goal="Report review results">
    <output>**?? Task Tickets Review Complete, {user_name}!**

**Story:** {{story_key}} - {{story_title}}

**Review Summary:**
- Total Tickets: {{ticket_count}}
- Ready for Work: {{ready_count}}
- Needs Improvement: {{needs_improvement_count}}
- Critical Issues: {{critical_issues_count}}

**Review Report:** {{review_report_path}}

**Next Steps:**
1. Review the detailed report
2. Update tickets with improvements (if needed)
3. Begin work on ready tickets using `dev-story` workflow
4. Address critical issues before starting work
    </output>
  </step>

</workflow>
