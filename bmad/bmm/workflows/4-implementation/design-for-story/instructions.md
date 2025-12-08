# Design for Story - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>
  <step n="1" goal="Load story">
    <action>Load story file</action>
    <action>Extract requirements</action>
  </step>
  <step n="2" goal="Create design policy">
    <action>Invoke create-design-policy workflow</action>
  </step>
  <step n="3" goal="Translate to UI">
    <action>Invoke translate-policy-to-ui workflow</action>
  </step>
  <step n="4" goal="Add to story">
    <action>Invoke add-design-to-story workflow</action>
  </step>
  <step n="5" goal="Complete">
    <action>Report completion</action>
  </step>
</workflow>