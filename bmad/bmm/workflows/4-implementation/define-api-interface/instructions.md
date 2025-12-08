# Define API Interface - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>Load ubiquitous language before defining API interfaces</critical>

<workflow>
  <step n="1" goal="Load context">
    <action>Load ubiquitous language</action>
    <action>Load story requirements</action>
    <action>Identify API needs</action>
  </step>
  <step n="2" goal="Define interface">
    <action>Define API endpoints using ubiquitous language terms</action>
    <action>Define request/response DTOs using language terms</action>
    <action>Document API contract</action>
    <action>Save interface definition</action>
  </step>
</workflow>