# Manage Policy Registry - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>
  <step n="1" goal="Load registry">
    <action>Load policy registry</action>
    <action>If doesn't exist, create empty registry</action>
  </step>

  <step n="2" goal="Execute action">
    <check if="action == 'search'">
      <action>Search policies by:
        - Keywords
        - Problem domain
        - Story key
        - Component type
      </action>
    </check>

    <check if="action == 'view'">
      <action>Display policy details:
        - Policy information
        - Related policies
        - Conflicts
        - Usage history
      </action>
    </check>

    <check if="action == 'update'">
      <action>Update policy:
        - Mark as deprecated
        - Update solution
        - Add notes
        - Change status
      </action>
    </check>

    <check if="action == 'organize'">
      <action>Organize registry:
        - Group by domain
        - Update relationships
        - Clean up duplicates
        - Archive old policies
      </action>
    </check>
  </step>

  <step n="3" goal="Save">
    <action>Save updated registry</action>
  </step>
</workflow>