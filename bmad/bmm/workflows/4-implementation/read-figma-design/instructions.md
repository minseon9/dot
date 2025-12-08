# Read Figma Design - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>Use Figma MCP tools to read designs</critical>

<workflow>
  <step n="1" goal="Connect to Figma">
    <action>Get Figma file ID or link from story</action>
    <action>Use Figma MCP to get document info</action>
    <action>Use Figma MCP to read design system</action>
  </step>
  <step n="2" goal="Extract design">
    <action>Extract colors, typography, spacing</action>
    <action>Extract components</action>
    <action>Extract UI patterns</action>
    <action>Document design specifications</action>
  </step>
</workflow>