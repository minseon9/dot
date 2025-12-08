# Update Design Policy - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow updates design policies when requirements change or design evolves. Must check for conflicts with existing policies.</critical>

<workflow>
  <step n="1" goal="Load story and existing policy">
    <action>Load story file</action>
    <action>Load existing policy file</action>
    <action>Load policy registry</action>
    <action>Identify what needs updating</action>
  </step>

  <step n="2" goal="Check existing policies">
    <action>Search registry for related policies</action>
    <action>Check if updated policy conflicts with existing policies</action>
    <action>Identify policies that might be affected</action>
  </step>

  <step n="3" goal="Update policies">
    <action>Update design policies based on changes</action>
    <action>Ensure alignment with design system</action>
    <action>Resolve any conflicts found</action>
    <action>Update registry with changes</action>
    <action>Save updated policy</action>
  </step>

  <step n="4" goal="Update story">
    <action>Update story with new policy reference</action>
    <action>Note any conflicts resolved</action>
    <action>Save story file</action>
  </step>
</workflow>