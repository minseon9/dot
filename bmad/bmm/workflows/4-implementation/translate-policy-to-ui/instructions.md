# Translate Policy to UI - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow translates concrete design policy solutions into UI designs in Figma. Must reference existing related policies.</critical>

<workflow>
  <step n="1" goal="Load policy and related policies">
    <action>Load design policy file</action>
    <action>Load policy registry</action>
    <action>Find related policies (e.g., if creating login UI, check for existing auth-related policies)</action>
    <action>Review related policies to ensure consistency</action>
    <action>Use Figma MCP to read design system</action>
  </step>

  <step n="2" goal="Apply related policies">
    <action>Reference existing related policies:
      - Use existing patterns where applicable
      - Maintain consistency with related designs
      - Apply established solutions
    </action>
    <action>Combine new policy with related policies</action>
  </step>

  <step n="3" goal="Create UI in Figma">
    <action>Use Figma MCP to create frames/components</action>
    <action>Apply design policies (both new and related) to UI</action>
    <action>Ensure design system compliance</action>
    <action>Ensure consistency with related UI designs</action>
    <action>Get Figma link for created design</action>
  </step>

  <step n="4" goal="Update registry">
    <action>Link UI design to policy in registry</action>
    <action>Note relationships with related policies</action>
    <action>Update registry with Figma link</action>
  </step>

  <step n="5" goal="Save and link">
    <action>Save Figma link to story</action>
    <action>Update story with design reference</action>
    <action>Note related policies used</action>
  </step>
</workflow>