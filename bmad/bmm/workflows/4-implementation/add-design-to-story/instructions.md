# Add Design to Story - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>
  <step n="1" goal="Load story and design">
    <action>Load story file</action>
    <action>Load design policy file</action>
    <action>Get Figma link</action>
  </step>
  <step n="2" goal="Add design section">
    <action>Add "## Design Policy" section to story</action>
    <action>Link to policy file</action>
    <action>Add "## Figma Design" section</action>
    <action>Add Figma link</action>
    <action>Add design summary</action>
  </step>
  <step n="3" goal="Save">
    <action>Save updated story file</action>
  </step>
</workflow>