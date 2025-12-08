# Read Design System - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>
  <step n="1" goal="Connect to Figma">
    <action>Get Figma file ID or link from user</action>
    <action>Use Figma MCP to get document info</action>
  </step>
  <step n="2" goal="Read design system">
    <action>Use Figma MCP to read design system components</action>
    <action>Extract: colors, typography, spacing, components, patterns</action>
    <action>Document design system structure</action>
  </step>
  <step n="3" goal="Save design system reference">
    <action>Save design system documentation</action>
    <action>Create reference for future use</action>
  </step>
</workflow>