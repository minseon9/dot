# Validate Language Usage - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>
  <step n="1" goal="Load language and target files">
    <action>Load ubiquitous language from {{language_file}}</action>
    <action>Identify files to validate:
      - Story files
      - Agent outputs
      - Documents
      - Code comments (if applicable)
    </action>
  </step>

  <step n="2" goal="Check language compliance">
    <action>For each file:
      1. Extract domain terms used
      2. Check if terms exist in ubiquitous language
      3. Check if terms match definitions
      4. Identify undefined terms
      5. Identify incorrect usage
    </action>
    <action>Generate compliance report</action>
    <template-output file="{output_folder}/language-validation-{{date}}.md">validation_report</template-output>
  </step>

  <step n="3" goal="Report violations">
    <action>List all violations:
      - Undefined terms used
      - Terms used incorrectly
      - Terms that should be added to language
    </action>
    <action>Provide recommendations for fixes</action>
  </step>
</workflow>