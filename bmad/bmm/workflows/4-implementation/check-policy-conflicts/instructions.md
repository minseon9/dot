# Check Policy Conflicts - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow checks for conflicts between design policies in the registry.</critical>

<workflow>
  <step n="1" goal="Load policy registry">
    <action>Load policy registry from {{policy_registry}}</action>
    <action>If registry doesn't exist, create empty registry</action>
  </step>

  <step n="2" goal="Identify policies to check">
    <action>If {{policy_id}} provided: Check that specific policy</action>
    <action>If {{check_all}} == true: Check all policies</action>
    <action>If neither: Ask user which policies to check</action>
  </step>

  <step n="3" goal="Check for conflicts">
    <action>For each policy, check against all other policies:
      - Same problem, different solution? (conflict)
      - Contradictory design decisions? (conflict)
      - Overlapping requirements? (potential conflict)
      - Same solution, different problem? (possible reuse)
    </action>
    <action>Identify conflict types:
      - Direct conflicts (contradictory solutions)
      - Partial conflicts (overlapping but different)
      - Dependencies (one depends on another)
      - Reuse opportunities (same solution applies)
    </action>
    <template-output file="{output_folder}/design-policies/conflict-report-{{date}}.md">conflict_report</template-output>
  </step>

  <step n="4" goal="Report conflicts">
    <action>Generate conflict report with:
      - List of conflicts found
      - Severity (high/medium/low)
      - Affected policies
      - Recommended resolutions
    </action>
    <action>Display report to user</action>
  </step>
</workflow>