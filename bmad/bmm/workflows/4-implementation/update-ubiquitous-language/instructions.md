# Update Ubiquitous Language - Workflow Instructions
<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<workflow>
  <step n="1" goal="Load language">
    <action>Load existing language file</action>
    <action>Identify what needs updating</action>
  </step>
  <step n="2" goal="Update">
    <action>Add/update terms</action>
    <action>Update definitions</action>
    <action>Save language file</action>
    <action>Run sync-language-to-agents to propagate updates</action>
  </step>
</workflow>