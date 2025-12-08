# Create Design Policy - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates design policies for story requirements. Design policies are concrete solutions that solve story requirements. Policies must be managed in a policy registry to detect conflicts and enable reuse.</critical>

<workflow>

  <step n="1" goal="Load config and identify story">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{story_file}} not provided:
      1. Search for story files in {{story_dir}}
      2. If multiple stories found, ask user to select
      3. If {{story_key}} provided, construct path: {{story_dir}}/{{story_key}}.md
    </action>
    <action>Load the COMPLETE story file</action>
    <action>Extract story information:
      - Problem Definition (the requirement being solved)
      - Acceptance Criteria
      - Story statement (As a... I want... So that...)
      - Current status
    </action>
  </step>

  <step n="2" goal="Load policy registry and check existing policies">
    <action>Load policy registry from {output_folder}/design-policies/registry.yaml (create if doesn't exist)</action>
    <action>Search existing policies for related/similar requirements:
      - Search by keywords from problem definition
      - Find policies that might conflict
      - Find policies that can be reused
      - Find policies that are dependencies
    </action>
    <action>Review existing policies:
      - Check if similar solution already exists
      - Identify potential conflicts
      - Identify reusable components
    </action>
    <template-output file="{design_policy_file}">existing_policies_analysis</template-output>
  </step>

  <step n="3" goal="Understand design system">
    <action>If {{design_system_ref}} provided:
      1. If Figma link: Use Figma MCP to read design system
      2. If document: Load design system documentation
      3. Extract: colors, typography, spacing, components, patterns
    </action>
    <action>If no design system reference:
      1. Ask user for Figma link or design system doc
      2. Or check if design system exists in project
    </action>
    <action>Understand design system constraints and patterns</action>
    <template-output file="{design_policy_file}">design_system_context</template-output>
  </step>

  <step n="4" goal="Analyze story requirements for design solutions">
    <action>Identify what needs to be solved:
      - What is the specific problem/requirement?
      - What user interactions are needed?
      - What information needs to be displayed?
      - What actions need to be available?
    </action>
    <action>For each requirement, determine:
      - What concrete solution/policy solves it?
      - Does an existing policy already solve this?
      - What new policy is needed?
      - How does it relate to existing policies?
    </action>
    <template-output file="{design_policy_file}">requirement_analysis</template-output>
  </step>

  <step n="5" goal="Create concrete design policy solutions">
    <action>For each requirement, create concrete solution (design policy):
      - Policy ID: Unique identifier (e.g., "auth-login-form")
      - Policy Name: Descriptive name
      - Problem: What requirement it solves
      - Solution: Concrete design solution (specific, actionable)
      - Rationale: Why this solution
      - Components Used: Design system components
      - Dependencies: Related policies this depends on
      - Conflicts: Policies this might conflict with
    </action>
    <action>Organize policies by:
      - Layout policies (where things go)
      - Component policies (what components to use)
      - Interaction policies (how users interact)
      - Visual policies (how things look)
      - Flow policies (user journeys)
    </action>
    <action>Ensure each policy is:
      - Concrete and specific (not vague)
      - Solves the story requirement
      - Traceable to story requirements
      - Documented clearly
    </action>
    <template-output file="{design_policy_file}">design_policies</template-output>
  </step>

  <step n="6" goal="Check for policy conflicts">
    <action>Compare new policies with existing policies in registry:
      - Check for conflicting solutions
      - Check for overlapping requirements
      - Check for contradictory decisions
      - Check for design system violations
    </action>
    <action>If conflicts found:
      1. List all conflicts
      2. Explain why they conflict
      3. Ask user how to resolve:
         - Use existing policy (reuse)
         - Replace existing policy (update)
         - Create new policy (different context)
         - Merge policies (combine)
    </action>
    <action>Resolve conflicts before proceeding</action>
    <template-output file="{design_policy_file}">conflict_analysis</template-output>
  </step>

  <step n="7" goal="Register policies in registry">
    <action>Add new policies to policy registry:
      - Policy ID
      - Policy Name
      - Story Key (which story created it)
      - Problem it solves
      - Solution summary
      - Dependencies
      - Related policies
      - Created date
      - Status (active, deprecated, etc.)
    </action>
    <action>Update registry.yaml with new policies</action>
    <action>Maintain registry structure:
      - Policies organized by domain/area
      - Searchable by keywords
      - Version tracked
      - Relationships mapped
    </action>
    <template-output file="{output_folder}/design-policies/registry.yaml">policy_registry</template-output>
  </step>

  <step n="8" goal="Validate policies against design system">
    <action>Check each policy:
      - Uses design system components
      - Follows design system patterns
      - Maintains consistency
      - Doesn't conflict with system
    </action>
    <action>Identify any gaps:
      - Policies that need new components
      - Policies that extend system
      - Policies that conflict with system
    </action>
    <action>Resolve conflicts or document extensions needed</action>
    <template-output file="{design_policy_file}">validation_results</template-output>
  </step>

  <step n="9" goal="Save and link to story">
    <action>Save design policy file</action>
    <action>Update story file with design policy reference:
      - Add "## Design Policy" section
      - Link to policy file
      - List policy IDs used
      - Include summary of key policies
      - Note any conflicts resolved
    </action>
    <action>Save story file</action>
    <action>Save updated registry</action>
    <output>**? Design Policy Created Successfully, {user_name}!**

**Policy Details:**
- Story Key: {{story_key}}
- Policy File: {{design_policy_file}}
- Policies Created: {{policy_count}}
- Conflicts Resolved: {{conflict_count}}
- Registry Updated: Yes

**Policy Registry:**
- Location: {output_folder}/design-policies/registry.yaml
- Total Policies: {{total_policies}}
- New Policies: {{new_policy_count}}

**Next Steps:**
1. Review design policies
2. Run `translate-policy-to-ui` to create Figma designs
3. Check registry for related policies when working on similar stories
    </output>
  </step>

</workflow>