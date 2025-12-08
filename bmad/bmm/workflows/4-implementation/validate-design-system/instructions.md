# Validate Design System - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>
  <step n="1" goal="Load design and system">
    <action>Load design file or Figma link</action>
    <action>Load design system reference</action>
  </step>
  <step n="2" goal="Validate compliance">
    <action>Check design uses system components</action>
    <action>Check design follows system patterns</action>
    <action>Check consistency with system</action>
    <action>Identify violations</action>
  </step>
  <step n="3" goal="Report">
    <action>Generate validation report</action>
    <action>List violations and recommendations</action>
  </step>
</workflow>